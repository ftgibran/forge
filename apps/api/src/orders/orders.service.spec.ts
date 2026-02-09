import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { PrismaService } from '@/prisma'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockPrismaService = {
  cart: {
    findUnique: vi.fn(),
  },
  order: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  cartItem: {
    deleteMany: vi.fn(),
  },
  productVariant: {
    update: vi.fn(),
  },

  $transaction: vi.fn((fn: (prisma: typeof mockPrismaService) => unknown) =>
    fn(mockPrismaService),
  ),
}

describe('OrdersService', () => {
  let service: OrdersService

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<OrdersService>(OrdersService)
  })

  describe('checkout', () => {
    it('should throw BadRequestException if cart is empty', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null)

      await expect(
        service.checkout('user-1', {
          shippingAddress: {
            street: '123 Main St',
            city: 'NYC',
            state: 'NY',
            zipCode: '10001',
            country: 'US',
          },
        }),
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('findOne', () => {
    it('should return an order by id', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue({
        id: '1',
        userId: 'u1',
        vendorId: 'v1',
        status: 'PENDING',
        totalAmount: 49.98,
        user: { id: 'u1', email: 'test@example.com', name: 'Test' },
        vendor: { id: 'v1', name: 'Test Vendor' },
        items: [],
      })

      const result = await service.findOne('1')
      expect(result.id).toBe('1')
    })

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null)
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException)
    })
  })
})
