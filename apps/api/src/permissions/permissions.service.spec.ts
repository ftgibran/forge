import { ConflictException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PrismaService } from '@/prisma'

import { PermissionsService } from './permissions.service'

const mockPrismaService = {
  permission: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
}

describe('PermissionsService', () => {
  let service: PermissionsService

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<PermissionsService>(PermissionsService)
  })

  describe('create', () => {
    it('should create a new permission', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null)
      mockPrismaService.permission.create.mockResolvedValue({
        id: '1',
        action: 'read',
        resource: 'user',
        description: 'Can read users',
      })

      const result = await service.create({
        action: 'read',
        resource: 'user',
        description: 'Can read users',
      })

      expect(result.action).toBe('read')
      expect(result.resource).toBe('user')
    })

    it('should throw ConflictException if permission exists', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue({
        id: '1',
        action: 'read',
        resource: 'user',
      })

      await expect(
        service.create({ action: 'read', resource: 'user' }),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('findAll', () => {
    it('should return paginated permissions', async () => {
      mockPrismaService.permission.findMany.mockResolvedValue([
        { id: '1', action: 'read', resource: 'user' },
      ])
      mockPrismaService.permission.count.mockResolvedValue(1)

      const result = await service.findAll({
        page: 1,
        limit: 10,
        get skip() {
          return 0
        },
      })

      expect(result.items).toHaveLength(1)
      expect(result.total).toBe(1)
    })
  })

  describe('findOne', () => {
    it('should return a permission by id', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue({
        id: '1',
        action: 'read',
        resource: 'user',
      })

      const result = await service.findOne('1')

      expect(result.action).toBe('read')
    })

    it('should throw NotFoundException if permission not found', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null)

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('should delete a permission', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue({
        id: '1',
        action: 'read',
        resource: 'user',
      })
      mockPrismaService.permission.delete.mockResolvedValue({
        id: '1',
        action: 'read',
        resource: 'user',
      })

      const result = await service.remove('1')

      expect(result.id).toBe('1')
    })
  })
})
