import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CartsController } from './carts.controller'
import { CartsService } from './carts.service'

const mockCartsService = {
  getCart: vi.fn(),
  addItem: vi.fn(),
  updateItem: vi.fn(),
  removeItem: vi.fn(),
  clearCart: vi.fn(),
}

describe('CartsController', () => {
  let controller: CartsController

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [{ provide: CartsService, useValue: mockCartsService }],
    }).compile()

    controller = module.get<CartsController>(CartsController)
  })

  describe('getCart', () => {
    it('should return the cart for the current user', async () => {
      const expected = { id: 'cart-1', items: [], total: 0 }

      mockCartsService.getCart.mockResolvedValue(expected)

      const result = await controller.getCart('user-1')

      expect(result).toEqual(expected)
      expect(mockCartsService.getCart).toHaveBeenCalledWith('user-1')
    })
  })

  describe('addItem', () => {
    it('should add an item to the cart', async () => {
      const dto = { variantId: 'var-1', quantity: 2 }
      const expected = {
        id: 'cart-1',
        items: [{ variantId: 'var-1', quantity: 2 }],
      }

      mockCartsService.addItem.mockResolvedValue(expected)

      const result = await controller.addItem('user-1', dto as any)

      expect(result).toEqual(expected)
      expect(mockCartsService.addItem).toHaveBeenCalledWith('user-1', dto)
    })
  })

  describe('updateItem', () => {
    it('should update the quantity of a cart item', async () => {
      const dto = { quantity: 5 }
      const expected = { id: 'cart-1', items: [{ id: 'item-1', quantity: 5 }] }

      mockCartsService.updateItem.mockResolvedValue(expected)

      const result = await controller.updateItem('user-1', 'item-1', dto as any)

      expect(result).toEqual(expected)
      expect(mockCartsService.updateItem).toHaveBeenCalledWith(
        'user-1',
        'item-1',
        dto,
      )
    })
  })

  describe('removeItem', () => {
    it('should remove an item from the cart', async () => {
      const expected = { id: 'cart-1', items: [] }

      mockCartsService.removeItem.mockResolvedValue(expected)

      const result = await controller.removeItem('user-1', 'item-1')

      expect(result).toEqual(expected)
      expect(mockCartsService.removeItem).toHaveBeenCalledWith(
        'user-1',
        'item-1',
      )
    })
  })

  describe('clearCart', () => {
    it('should clear the entire cart', async () => {
      const expected = { id: 'cart-1', items: [] }

      mockCartsService.clearCart.mockResolvedValue(expected)

      const result = await controller.clearCart('user-1')

      expect(result).toEqual(expected)
      expect(mockCartsService.clearCart).toHaveBeenCalledWith('user-1')
    })
  })
})
