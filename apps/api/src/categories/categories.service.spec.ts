import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { PrismaService } from '@/prisma'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockPrismaService = {
  category: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}

describe('CategoriesService', () => {
  let service: CategoriesService

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<CategoriesService>(CategoriesService)
  })

  describe('create', () => {
    it('should create a new category', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null)
      mockPrismaService.category.create.mockResolvedValue({
        id: '1',
        name: 'Filaments',
        slug: 'filaments',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await service.create({
        name: 'Filaments',
        slug: 'filaments',
      })
      expect(result.name).toBe('Filaments')
    })

    it('should throw ConflictException if slug exists', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue({ id: '1' })

      await expect(
        service.create({ name: 'Filaments', slug: 'filaments' }),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue({
        id: '1',
        name: 'Filaments',
        slug: 'filaments',
        children: [],
        parent: null,
        _count: { products: 0 },
      })

      const result = await service.findOne('1')
      expect(result.id).toBe('1')
    })

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null)
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('should delete a category', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue({
        id: '1',
        name: 'Filaments',
        slug: 'filaments',
        children: [],
        parent: null,
        _count: { products: 0 },
      })
      mockPrismaService.category.delete.mockResolvedValue({
        id: '1',
        name: 'Filaments',
        slug: 'filaments',
      })

      const result = await service.remove('1')
      expect(result.id).toBe('1')
    })
  })
})
