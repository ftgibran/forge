import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'

const mockProductsService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  addVariant: vi.fn(),
  updateVariant: vi.fn(),
  removeVariant: vi.fn(),
  addImage: vi.fn(),
  updateImage: vi.fn(),
  removeImage: vi.fn(),
}

describe('ProductsController', () => {
  let controller: ProductsController

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile()

    controller = module.get<ProductsController>(ProductsController)
  })

  describe('create', () => {
    it('should create a product', async () => {
      const dto = { name: 'Widget', price: 9.99 }
      const expected = { id: 'prod-1', name: 'Widget' }

      mockProductsService.create.mockResolvedValue(expected)

      const result = await controller.create(dto as any)

      expect(result).toEqual(expected)
      expect(mockProductsService.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('findAll', () => {
    it('should return paginated products', async () => {
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

      mockProductsService.findAll.mockResolvedValue(expected)

      const result = await controller.findAll(query as any)

      expect(result).toEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const expected = { id: 'prod-1', name: 'Widget' }

      mockProductsService.findOne.mockResolvedValue(expected)

      const result = await controller.findOne('prod-1')

      expect(result).toEqual(expected)
    })
  })

  describe('update', () => {
    it('should update a product', async () => {
      const dto = { name: 'Updated Widget' }
      const expected = { id: 'prod-1', name: 'Updated Widget' }

      mockProductsService.update.mockResolvedValue(expected)

      const result = await controller.update('prod-1', dto as any)

      expect(result).toEqual(expected)
      expect(mockProductsService.update).toHaveBeenCalledWith('prod-1', dto)
    })
  })

  describe('remove', () => {
    it('should delete a product', async () => {
      const expected = { id: 'prod-1', name: 'Widget' }

      mockProductsService.remove.mockResolvedValue(expected)

      const result = await controller.remove('prod-1')

      expect(result).toEqual(expected)
    })
  })

  describe('addVariant', () => {
    it('should add a variant to a product', async () => {
      const dto = { sku: 'SKU-001', price: 9.99 }
      const expected = { id: 'var-1', sku: 'SKU-001' }

      mockProductsService.addVariant.mockResolvedValue(expected)

      const result = await controller.addVariant('prod-1', dto as any)

      expect(result).toEqual(expected)
      expect(mockProductsService.addVariant).toHaveBeenCalledWith('prod-1', dto)
    })
  })

  describe('updateVariant', () => {
    it('should update a product variant', async () => {
      const dto = { price: 19.99 }
      const expected = { id: 'var-1', price: 19.99 }

      mockProductsService.updateVariant.mockResolvedValue(expected)

      const result = await controller.updateVariant(
        'prod-1',
        'var-1',
        dto as any,
      )

      expect(result).toEqual(expected)
      expect(mockProductsService.updateVariant).toHaveBeenCalledWith(
        'prod-1',
        'var-1',
        dto,
      )
    })
  })

  describe('removeVariant', () => {
    it('should remove a product variant', async () => {
      mockProductsService.removeVariant.mockResolvedValue(undefined)

      await controller.removeVariant('prod-1', 'var-1')

      expect(mockProductsService.removeVariant).toHaveBeenCalledWith(
        'prod-1',
        'var-1',
      )
    })
  })

  describe('addImage', () => {
    it('should add an image to a product', async () => {
      const dto = { mediaId: 1, position: 0 }
      const expected = { id: 'img-1', mediaId: 1 }

      mockProductsService.addImage.mockResolvedValue(expected)

      const result = await controller.addImage('prod-1', dto as any)

      expect(result).toEqual(expected)
      expect(mockProductsService.addImage).toHaveBeenCalledWith('prod-1', dto)
    })
  })

  describe('updateImage', () => {
    it('should update a product image', async () => {
      const dto = { position: 1 }
      const expected = { id: 'img-1', position: 1 }

      mockProductsService.updateImage.mockResolvedValue(expected)

      const result = await controller.updateImage('prod-1', 'img-1', dto as any)

      expect(result).toEqual(expected)
      expect(mockProductsService.updateImage).toHaveBeenCalledWith(
        'prod-1',
        'img-1',
        dto,
      )
    })
  })

  describe('removeImage', () => {
    it('should remove a product image', async () => {
      mockProductsService.removeImage.mockResolvedValue(undefined)

      await controller.removeImage('prod-1', 'img-1')

      expect(mockProductsService.removeImage).toHaveBeenCalledWith(
        'prod-1',
        'img-1',
      )
    })
  })
})
