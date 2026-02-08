import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { RolesService } from './roles.service'
import { PrismaService } from '@/prisma'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockPrismaService = {
  role: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  rolePermission: {
    create: vi.fn(),
    delete: vi.fn(),
  },
}

describe('RolesService', () => {
  let service: RolesService

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<RolesService>(RolesService)
  })

  describe('create', () => {
    it('should create a new role', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null)
      mockPrismaService.role.create.mockResolvedValue({
        id: '1',
        name: 'admin',
        description: 'Admin role',
      })

      const result = await service.create({
        name: 'admin',
        description: 'Admin role',
      })
      expect(result.name).toBe('admin')
    })

    it('should throw ConflictException if role name exists', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue({
        id: '1',
        name: 'admin',
      })

      await expect(service.create({ name: 'admin' })).rejects.toThrow(
        ConflictException,
      )
    })
  })

  describe('findAll', () => {
    it('should return paginated roles', async () => {
      mockPrismaService.role.findMany.mockResolvedValue([
        { id: '1', name: 'admin', rolePermissions: [] },
      ])
      mockPrismaService.role.count.mockResolvedValue(1)

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
    it('should return a role by id', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue({
        id: '1',
        name: 'admin',
        rolePermissions: [],
        userRoles: [],
      })

      const result = await service.findOne('1')
      expect(result.name).toBe('admin')
    })

    it('should throw NotFoundException if role not found', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null)

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException)
    })
  })

  describe('assignPermission', () => {
    it('should assign a permission to a role', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue({
        id: '1',
        name: 'admin',
        rolePermissions: [],
        userRoles: [],
      })
      mockPrismaService.rolePermission.create.mockResolvedValue({
        roleId: '1',
        permissionId: 'perm-1',
        permission: { id: 'perm-1', action: 'read', resource: 'user' },
      })

      const result = await service.assignPermission('1', 'perm-1')
      expect(result.permissionId).toBe('perm-1')
    })
  })
})
