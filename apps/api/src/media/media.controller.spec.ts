import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MediaController } from './media.controller'
import { MediaService } from './media.service'

const mockMediaService = {
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  processAndUpload: vi.fn(),
  deleteMedia: vi.fn(),
}

describe('MediaController', () => {
  let controller: MediaController

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [{ provide: MediaService, useValue: mockMediaService }],
    }).compile()

    controller = module.get<MediaController>(MediaController)
  })

  describe('findAll', () => {
    it('should return paginated media list', async () => {
      const query = { page: 1, limit: 20 }
      const expected = { items: [], total: 0, page: 1, limit: 20 }

      mockMediaService.findAll.mockResolvedValue(expected)

      const result = await controller.findAll(query as any)

      expect(result).toEqual(expected)
      expect(mockMediaService.findAll).toHaveBeenCalledWith(query)
    })
  })

  describe('findOne', () => {
    it('should return media by id', async () => {
      const expected = { id: 1, url: 'https://cdn.example.com/img.webp' }

      mockMediaService.findOne.mockResolvedValue(expected)

      const result = await controller.findOne(1)

      expect(result).toEqual(expected)
      expect(mockMediaService.findOne).toHaveBeenCalledWith(1)
    })
  })

  describe('update', () => {
    it('should update media alt text', async () => {
      const dto = { alt: 'New alt text' }
      const expected = { id: 1, alt: 'New alt text' }

      mockMediaService.update.mockResolvedValue(expected)

      const result = await controller.update(1, dto as any)

      expect(result).toEqual(expected)
      expect(mockMediaService.update).toHaveBeenCalledWith(1, dto)
    })
  })

  describe('upload', () => {
    it('should upload a file and return media', async () => {
      const file = {
        buffer: Buffer.from('fake-image'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File
      const expected = { id: 1, url: 'https://cdn.example.com/test.webp' }

      mockMediaService.processAndUpload.mockResolvedValue(expected)

      const result = await controller.upload(file, 'alt text')

      expect(result).toEqual(expected)
      expect(mockMediaService.processAndUpload).toHaveBeenCalledWith(
        file,
        'alt text',
      )
    })

    it('should pass undefined alt when not provided', async () => {
      const file = {
        buffer: Buffer.from('fake-image'),
        originalname: 'test.jpg',
      } as Express.Multer.File

      mockMediaService.processAndUpload.mockResolvedValue({ id: 1 })

      await controller.upload(file, undefined)

      expect(mockMediaService.processAndUpload).toHaveBeenCalledWith(
        file,
        undefined,
      )
    })
  })

  describe('delete', () => {
    it('should delete media by id', async () => {
      mockMediaService.deleteMedia.mockResolvedValue(undefined)

      await controller.delete(1)

      expect(mockMediaService.deleteMedia).toHaveBeenCalledWith(1)
    })
  })
})
