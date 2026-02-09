import { ConflictException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PrismaService } from '@/prisma'

import { UsersService } from './users.service'

const mockPrismaService = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  userRole: {
    create: vi.fn(),
    delete: vi.fn(),
  },
  userPermission: {
    create: vi.fn(),
    delete: vi.fn(),
  },
}

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  describe('create', () => {
    it('should create a new user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)
      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await service.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      })

      expect(result.email).toBe('test@example.com')
      expect(result).not.toHaveProperty('password')
    })

    it('should throw ConflictException if email exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' })

      await expect(
        service.create({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('findAll', () => {
    it('should return paginated users', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([
        {
          id: '1',
          email: 'test@example.com',
          name: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
      mockPrismaService.user.count.mockResolvedValue(1)

      const result = await service.findAll({
        page: 1,
        limit: 10,
        get skip() {
          return 0
        },
      })

      expect(result.items).toHaveLength(1)
      expect(result.total).toBe(1)
      expect(result.totalPages).toBe(1)
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        userRoles: [],
        userPermissions: [],
      })

      const result = await service.findOne('1')

      expect(result.id).toBe('1')
    })

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('should delete a user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        userRoles: [],
        userPermissions: [],
      })
      mockPrismaService.user.delete.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      })

      const result = await service.remove('1')

      expect(result.id).toBe('1')
    })
  })

  describe('assignRole', () => {
    it('should assign a role to a user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        userRoles: [],
        userPermissions: [],
      })
      mockPrismaService.userRole.create.mockResolvedValue({
        userId: '1',
        roleId: 'role-1',
        role: { id: 'role-1', name: 'admin' },
      })

      const result = await service.assignRole('1', 'role-1')

      expect(result.roleId).toBe('role-1')
    })
  })
})
