import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ReviewsController } from './reviews.controller'
import { ReviewsService } from './reviews.service'

const mockReviewsService = {
  create: vi.fn(),
  findByProduct: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}

describe('ReviewsController', () => {
  let controller: ReviewsController

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [{ provide: ReviewsService, useValue: mockReviewsService }],
    }).compile()

    controller = module.get<ReviewsController>(ReviewsController)
  })

  describe('create', () => {
    it('should create a review', async () => {
      const dto = { productId: 'prod-1', rating: 5, comment: 'Great!' }
      const expected = { id: 'rev-1', rating: 5 }

      mockReviewsService.create.mockResolvedValue(expected)

      const result = await controller.create(dto as any, 'user-1')

      expect(result).toEqual(expected)
      expect(mockReviewsService.create).toHaveBeenCalledWith(dto, 'user-1')
    })
  })

  describe('findByProduct', () => {
    it('should return paginated reviews for a product', async () => {
      const query = {
        page: 1,
        limit: 10,
        get skip() {
          return 0
        },
      }
      const expected = { items: [{ id: 'rev-1', rating: 5 }], total: 1 }

      mockReviewsService.findByProduct.mockResolvedValue(expected)

      const result = await controller.findByProduct('prod-1', query as any)

      expect(result).toEqual(expected)
      expect(mockReviewsService.findByProduct).toHaveBeenCalledWith(
        'prod-1',
        query,
      )
    })
  })

  describe('findOne', () => {
    it('should return a review by id', async () => {
      const expected = { id: 'rev-1', rating: 5, comment: 'Great!' }

      mockReviewsService.findOne.mockResolvedValue(expected)

      const result = await controller.findOne('rev-1')

      expect(result).toEqual(expected)
    })
  })

  describe('update', () => {
    it('should update a review', async () => {
      const dto = { comment: 'Updated comment' }
      const expected = { id: 'rev-1', comment: 'Updated comment' }

      mockReviewsService.update.mockResolvedValue(expected)

      const result = await controller.update('rev-1', dto as any, 'user-1')

      expect(result).toEqual(expected)
      expect(mockReviewsService.update).toHaveBeenCalledWith(
        'rev-1',
        dto,
        'user-1',
      )
    })
  })

  describe('remove', () => {
    it('should delete a review', async () => {
      const expected = { id: 'rev-1', rating: 5 }

      mockReviewsService.remove.mockResolvedValue(expected)

      const result = await controller.remove('rev-1')

      expect(result).toEqual(expected)
    })
  })
})
