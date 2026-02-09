import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PrismaService } from '@/prisma'

import { CartsService } from './carts.service'

const mockPrismaService = {
  cart: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  cartItem: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
  productVariant: {
    findUnique: vi.fn(),
  },
}

describe('CartsService', () => {
  let service: CartsService

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<CartsService>(CartsService)
  })

  describe('getCart', () => {
    it('should return empty items if no cart', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null)
      const result = await service.getCart('user-1')

      expect(result.items).toEqual([])
    })

    it('should return cart with items', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue({
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            id: 'item-1',
            quantity: 2,
            variant: { id: 'v1', name: 'White', product: { name: 'PLA' } },
          },
        ],
      })

      const result = await service.getCart('user-1')

      expect(result.items).toHaveLength(1)
    })
  })

  describe('addItem', () => {
    it('should throw NotFoundException for invalid variant', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null)
      mockPrismaService.cart.create.mockResolvedValue({
        id: 'cart-1',
        userId: 'user-1',
      })
      mockPrismaService.productVariant.findUnique.mockResolvedValue(null)

      await expect(
        service.addItem('user-1', { variantId: 'bad', quantity: 1 }),
      ).rejects.toThrow(NotFoundException)
    })
  })
})
