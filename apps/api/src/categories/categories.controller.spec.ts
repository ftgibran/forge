import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'

const mockCategoriesService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}

describe('CategoriesController', () => {
  let controller: CategoriesController

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
      ],
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)
  })

  describe('create', () => {
    it('should create a category', async () => {
      const dto = { name: 'Electronics', slug: 'electronics' }
      const expected = { id: 'cat-1', name: 'Electronics', slug: 'electronics' }

      mockCategoriesService.create.mockResolvedValue(expected)

      const result = await controller.create(dto as any)

      expect(result).toEqual(expected)
      expect(mockCategoriesService.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('findAll', () => {
    it('should return all categories', async () => {
      const expected = [{ id: 'cat-1', name: 'Electronics' }]

      mockCategoriesService.findAll.mockResolvedValue(expected)

      const result = await controller.findAll()

      expect(result).toEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const expected = { id: 'cat-1', name: 'Electronics' }

      mockCategoriesService.findOne.mockResolvedValue(expected)

      const result = await controller.findOne('cat-1')

      expect(result).toEqual(expected)
    })
  })

  describe('update', () => {
    it('should update a category', async () => {
      const dto = { name: 'Updated' }
      const expected = { id: 'cat-1', name: 'Updated' }

      mockCategoriesService.update.mockResolvedValue(expected)

      const result = await controller.update('cat-1', dto as any)

      expect(result).toEqual(expected)
      expect(mockCategoriesService.update).toHaveBeenCalledWith('cat-1', dto)
    })
  })

  describe('remove', () => {
    it('should delete a category', async () => {
      const expected = { id: 'cat-1', name: 'Electronics' }

      mockCategoriesService.remove.mockResolvedValue(expected)

      const result = await controller.remove('cat-1')

      expect(result).toEqual(expected)
    })
  })
})
