import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PrismaService } from '@/prisma'

import { ReviewsService } from './reviews.service'

const mockPrismaService = {
  review: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  orderItem: {
    findFirst: vi.fn(),
  },
}

describe('ReviewsService', () => {
  let service: ReviewsService

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<ReviewsService>(ReviewsService)
  })

  describe('create', () => {
    it('should throw if user has no delivered order for product', async () => {
      mockPrismaService.orderItem.findFirst.mockResolvedValue(null)

      await expect(
        service.create(
          { productId: 'p1', rating: 5, title: 'Great' },
          'user-1',
        ),
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw if user already reviewed the product', async () => {
      mockPrismaService.orderItem.findFirst.mockResolvedValue({ id: 'oi1' })
      mockPrismaService.review.findUnique.mockResolvedValue({ id: 'r1' })

      await expect(
        service.create(
          { productId: 'p1', rating: 5, title: 'Great' },
          'user-1',
        ),
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('findOne', () => {
    it('should return a review by id', async () => {
      mockPrismaService.review.findUnique.mockResolvedValue({
        id: '1',
        userId: 'u1',
        productId: 'p1',
        rating: 5,
        title: 'Great',
        user: { id: 'u1', name: 'Test' },
        product: { id: 'p1', name: 'PLA', slug: 'pla' },
      })

      const result = await service.findOne('1')

      expect(result.id).toBe('1')
    })

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.review.findUnique.mockResolvedValue(null)
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException)
    })
  })
})
