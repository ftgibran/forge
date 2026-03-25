import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'

const mockOrdersService = {
  checkout: vi.fn(),
  findAll: vi.fn(),
  findMyOrders: vi.fn(),
  findOne: vi.fn(),
  updateStatus: vi.fn(),
}

describe('OrdersController', () => {
  let controller: OrdersController

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compile()

    controller = module.get<OrdersController>(OrdersController)
  })

  describe('checkout', () => {
    it('should checkout and create an order', async () => {
      const dto = { shippingAddressId: 'addr-1' }
      const expected = { id: 'order-1', status: 'pending' }

      mockOrdersService.checkout.mockResolvedValue(expected)

      const result = await controller.checkout('user-1', dto as any)

      expect(result).toEqual(expected)
      expect(mockOrdersService.checkout).toHaveBeenCalledWith('user-1', dto)
    })
  })

  describe('findAll', () => {
    it('should return paginated orders', async () => {
      const query = {
        page: 1,
        limit: 10,
        get skip() {
          return 0
        },
      }
      const expected = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      }

      mockOrdersService.findAll.mockResolvedValue(expected)

      const result = await controller.findAll(query as any)

      expect(result).toEqual(expected)
    })
  })

  describe('findMyOrders', () => {
    it('should return orders for the current user', async () => {
      const query = {
        page: 1,
        limit: 10,
        get skip() {
          return 0
        },
      }
      const expected = { items: [{ id: 'order-1' }], total: 1 }

      mockOrdersService.findMyOrders.mockResolvedValue(expected)

      const result = await controller.findMyOrders('user-1', query as any)

      expect(result).toEqual(expected)
      expect(mockOrdersService.findMyOrders).toHaveBeenCalledWith(
        'user-1',
        query,
      )
    })
  })

  describe('findOne', () => {
    it('should return an order by id', async () => {
      const expected = { id: 'order-1', status: 'pending', items: [] }

      mockOrdersService.findOne.mockResolvedValue(expected)

      const result = await controller.findOne('order-1')

      expect(result).toEqual(expected)
    })
  })

  describe('updateStatus', () => {
    it('should update the order status', async () => {
      const dto = { status: 'shipped' }
      const expected = { id: 'order-1', status: 'shipped' }

      mockOrdersService.updateStatus.mockResolvedValue(expected)

      const result = await controller.updateStatus('order-1', dto as any)

      expect(result).toEqual(expected)
      expect(mockOrdersService.updateStatus).toHaveBeenCalledWith(
        'order-1',
        dto,
      )
    })
  })
})
