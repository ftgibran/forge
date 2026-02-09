import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { VendorsService } from './vendors.service'
import { PrismaService } from '@/prisma'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockPrismaService = {
  vendor: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  vendorApplication: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
}

describe('VendorsService', () => {
  let service: VendorsService

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<VendorsService>(VendorsService)
  })

  describe('create', () => {
    it('should create a new vendor', async () => {
      mockPrismaService.vendor.findUnique.mockResolvedValue(null)
      mockPrismaService.vendor.create.mockResolvedValue({
        id: '1',
        name: 'Test Vendor',
        slug: 'test-vendor',
        ownerId: 'user-1',
        status: 'PENDING',
        owner: { id: 'user-1', email: 'test@example.com', name: 'Test' },
      })

      const result = await service.create(
        { name: 'Test Vendor', slug: 'test-vendor' },
        'user-1',
      )
      expect(result.name).toBe('Test Vendor')
      expect(result.status).toBe('PENDING')
    })

    it('should throw ConflictException if user already has a vendor', async () => {
      mockPrismaService.vendor.findUnique.mockResolvedValueOnce({ id: '1' })

      await expect(
        service.create({ name: 'Test', slug: 'test' }, 'user-1'),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('findOne', () => {
    it('should return a vendor by id', async () => {
      mockPrismaService.vendor.findUnique.mockResolvedValue({
        id: '1',
        name: 'Test Vendor',
        slug: 'test-vendor',
        ownerId: 'user-1',
        owner: { id: 'user-1', email: 'test@example.com', name: 'Test' },
        _count: { products: 0 },
      })

      const result = await service.findOne('1')
      expect(result.id).toBe('1')
    })

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.vendor.findUnique.mockResolvedValue(null)
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException)
    })
  })
})
