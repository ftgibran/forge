import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { ProductsService } from './products.service'
import { PrismaService } from '@/prisma'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockPrismaService = {
  product: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  productVariant: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  productImage: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  review: {
    aggregate: vi.fn(),
  },
}

describe('ProductsService', () => {
  let service: ProductsService

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
  })

  describe('create', () => {
    it('should create a new product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null)
      mockPrismaService.product.create.mockResolvedValue({
        id: '1',
        name: 'PLA Filament',
        slug: 'pla-filament',
        vendorId: 'v1',
        status: 'DRAFT',
        vendor: { id: 'v1', name: 'Test Vendor', slug: 'test' },
        category: null,
        variants: [],
        images: [],
      })

      const result = await service.create({
        name: 'PLA Filament',
        slug: 'pla-filament',
        vendorId: 'v1',
      })
      expect(result.name).toBe('PLA Filament')
    })

    it('should throw ConflictException if slug exists', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue({ id: '1' })

      await expect(
        service.create({
          name: 'PLA Filament',
          slug: 'pla-filament',
          vendorId: 'v1',
        }),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue({
        id: '1',
        name: 'PLA Filament',
        slug: 'pla-filament',
        vendor: { id: 'v1', name: 'Test', slug: 'test' },
        category: null,
        variants: [],
        images: [],
        reviews: [],
        _count: { reviews: 0 },
      })
      mockPrismaService.review.aggregate.mockResolvedValue({
        _avg: { rating: null },
      })

      const result = await service.findOne('1')
      expect(result.id).toBe('1')
      expect(result.averageRating).toBe(0)
    })

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null)
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException)
    })
  })

  describe('addVariant', () => {
    it('should add a variant to a product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue({
        id: '1',
        name: 'PLA',
        vendor: { id: 'v1', name: 'Test', slug: 'test' },
        category: null,
        variants: [],
        images: [],
        reviews: [],
        _count: { reviews: 0 },
      })
      mockPrismaService.review.aggregate.mockResolvedValue({
        _avg: { rating: null },
      })
      mockPrismaService.productVariant.findUnique.mockResolvedValue(null)
      mockPrismaService.productVariant.create.mockResolvedValue({
        id: 'v1',
        productId: '1',
        name: 'White',
        sku: 'PLA-WHT',
        price: 24.99,
        stock: 100,
      })

      const result = await service.addVariant('1', {
        name: 'White',
        sku: 'PLA-WHT',
        price: 24.99,
        stock: 100,
      })
      expect(result.sku).toBe('PLA-WHT')
    })
  })
})
