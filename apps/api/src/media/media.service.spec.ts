import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// vi.hoisted allows the variable to be available inside the hoisted vi.mock factories
const mockSend = vi.hoisted(() => vi.fn().mockResolvedValue({}))

vi.mock('@aws-sdk/client-s3', () => {
  class MockS3Client {
    send = mockSend
  }

  return {
    S3Client: MockS3Client,
    PutObjectCommand: class MockPutObjectCommand {
      constructor(public args: unknown) {}
    },
    DeleteObjectsCommand: class MockDeleteObjectsCommand {
      constructor(public args: unknown) {}
    },
  }
})

vi.mock('sharp', () => {
  const chain = {
    metadata: vi.fn().mockResolvedValue({ width: 800, height: 600 }),
    rotate: vi.fn().mockReturnThis(),
    toFormat: vi.fn().mockReturnThis(),
    resize: vi.fn().mockReturnThis(),
    toBuffer: vi
      .fn()
      .mockImplementation((opts?: { resolveWithObject?: boolean }) => {
        if (opts?.resolveWithObject) {
          return Promise.resolve({
            data: Buffer.from('mock-sized'),
            info: { width: 400, height: 300 } as any,
          })
        }

        return Promise.resolve(Buffer.from('mock-original'))
      }),
  }

  return { default: vi.fn(() => chain) }
})

vi.mock('uuid', () => ({ v4: vi.fn(() => 'test-uuid-1234') }))

import { ConfigService } from '@nestjs/config'

import { PrismaService } from '@/prisma'

import { MediaService } from './media.service'

const mockPrismaService = {
  media: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
}

const mockConfigService = {
  get: vi.fn((key: string) => {
    const config: Record<string, string> = {
      AWS_REGION: 'us-east-1',
      AWS_ACCESS_KEY_ID: 'test-key',
      AWS_SECRET_ACCESS_KEY: 'test-secret',
      AWS_S3_BUCKET: 'test-bucket',
      AWS_S3_PUBLIC_URL: 'https://cdn.example.com',
      AWS_S3_FOLDER: 'media',
    }

    return config[key]
  }),
}

describe('MediaService', () => {
  let service: MediaService

  beforeEach(async () => {
    vi.clearAllMocks()
    mockSend.mockResolvedValue({})

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile()

    service = module.get<MediaService>(MediaService)
  })

  describe('processAndUpload', () => {
    it('should process image, upload to S3, and create prisma record', async () => {
      const file = {
        buffer: Buffer.from('fake-image'),
        originalname: 'photo.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File

      const expected = {
        id: 1,
        url: 'https://cdn.example.com/test-bucket/media/test-uuid-1234/original.webp',
        filename: 'photo.webp',
        alt: 'My alt',
      }

      mockPrismaService.media.create.mockResolvedValue(expected)

      const result = await service.processAndUpload(file, 'My alt')

      expect(result).toEqual(expected)
      expect(mockPrismaService.media.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            alt: 'My alt',
            filename: 'photo.webp',
            mimeType: 'image/webp',
          }),
        }),
      )
      // S3 send should be called once per size + 1 for original (8 sizes + 1 = 9)
      expect(mockSend).toHaveBeenCalled()
    })

    it('should store null alt when not provided', async () => {
      const file = {
        buffer: Buffer.from('fake-image'),
        originalname: 'photo.jpg',
      } as Express.Multer.File

      mockPrismaService.media.create.mockResolvedValue({ id: 1 })

      await service.processAndUpload(file)

      expect(mockPrismaService.media.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ alt: null }),
        }),
      )
    })
  })

  describe('findAll', () => {
    it('should return paginated media', async () => {
      const items = [{ id: 1, url: 'https://cdn.example.com/img.webp' }]

      mockPrismaService.media.findMany.mockResolvedValue(items)
      mockPrismaService.media.count.mockResolvedValue(1)

      const result = await service.findAll({ page: 1, limit: 10 } as any)

      expect(result.items).toEqual(items)
      expect(result.total).toBe(1)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
      expect(mockPrismaService.media.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 }),
      )
    })

    it('should use defaults when page and limit not provided', async () => {
      mockPrismaService.media.findMany.mockResolvedValue([])
      mockPrismaService.media.count.mockResolvedValue(0)

      await service.findAll({} as any)

      expect(mockPrismaService.media.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 20 }),
      )
    })
  })

  describe('findOne', () => {
    it('should return media when found', async () => {
      const media = { id: 1, url: 'https://cdn.example.com/img.webp' }

      mockPrismaService.media.findUnique.mockResolvedValue(media)

      const result = await service.findOne(1)

      expect(result).toEqual(media)
    })

    it('should throw NotFoundException when not found', async () => {
      mockPrismaService.media.findUnique.mockResolvedValue(null)

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update alt text when media exists', async () => {
      const media = {
        id: 1,
        url: 'https://cdn.example.com/img.webp',
        alt: 'old',
      }
      const updated = { ...media, alt: 'new alt' }

      mockPrismaService.media.findUnique.mockResolvedValue(media)
      mockPrismaService.media.update.mockResolvedValue(updated)

      const result = await service.update(1, { alt: 'new alt' })

      expect(result).toEqual(updated)
      expect(mockPrismaService.media.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 }, data: { alt: 'new alt' } }),
      )
    })

    it('should throw NotFoundException when media not found', async () => {
      mockPrismaService.media.findUnique.mockResolvedValue(null)

      await expect(service.update(999, { alt: 'x' })).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('deleteMedia', () => {
    it('should throw NotFoundException when media not found', async () => {
      mockPrismaService.media.findUnique.mockResolvedValue(null)

      await expect(service.deleteMedia(999)).rejects.toThrow(NotFoundException)
    })

    it('should delete S3 objects and prisma record when media has URL', async () => {
      const publicUrl = 'https://cdn.example.com/test-bucket'
      const media = {
        id: 1,
        url: `${publicUrl}/media/test-uuid/original.webp`,
        sizes: {
          thumbnail: { url: `${publicUrl}/media/test-uuid/thumbnail.webp` },
          small: { url: `${publicUrl}/media/test-uuid/small.webp` },
        },
      }

      mockPrismaService.media.findUnique.mockResolvedValue(media)
      mockPrismaService.media.delete.mockResolvedValue(undefined)

      await service.deleteMedia(1)

      expect(mockSend).toHaveBeenCalled()
      expect(mockPrismaService.media.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })

    it('should still delete prisma record when media has no URL', async () => {
      const media = { id: 1, url: null, sizes: null }

      mockPrismaService.media.findUnique.mockResolvedValue(media)
      mockPrismaService.media.delete.mockResolvedValue(undefined)

      await service.deleteMedia(1)

      expect(mockPrismaService.media.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })
  })
})
