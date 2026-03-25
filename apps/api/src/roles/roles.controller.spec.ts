import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'

const mockRolesService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  assignPermission: vi.fn(),
  removePermission: vi.fn(),
}

describe('RolesController', () => {
  let controller: RolesController

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [{ provide: RolesService, useValue: mockRolesService }],
    }).compile()

    controller = module.get<RolesController>(RolesController)
  })

  describe('create', () => {
    it('should create a role', async () => {
      const dto = { name: 'editor', description: 'Can edit' }
      const expected = { id: 'role-1', name: 'editor' }

      mockRolesService.create.mockResolvedValue(expected)

      const result = await controller.create(dto as any)

      expect(result).toEqual(expected)
      expect(mockRolesService.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('findAll', () => {
    it('should return paginated roles', async () => {
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

      mockRolesService.findAll.mockResolvedValue(expected)

      const result = await controller.findAll(query as any)

      expect(result).toEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a role by id', async () => {
      const expected = { id: 'role-1', name: 'editor' }

      mockRolesService.findOne.mockResolvedValue(expected)

      const result = await controller.findOne('role-1')

      expect(result).toEqual(expected)
    })
  })

  describe('update', () => {
    it('should update a role', async () => {
      const dto = { description: 'Updated' }
      const expected = { id: 'role-1', name: 'editor', description: 'Updated' }

      mockRolesService.update.mockResolvedValue(expected)

      const result = await controller.update('role-1', dto as any)

      expect(result).toEqual(expected)
      expect(mockRolesService.update).toHaveBeenCalledWith('role-1', dto)
    })
  })

  describe('remove', () => {
    it('should delete a role', async () => {
      const expected = { id: 'role-1', name: 'editor' }

      mockRolesService.remove.mockResolvedValue(expected)

      const result = await controller.remove('role-1')

      expect(result).toEqual(expected)
    })
  })

  describe('assignPermission', () => {
    it('should assign a permission to a role', async () => {
      const dto = { permissionId: 'perm-1' }
      const expected = { roleId: 'role-1', permissionId: 'perm-1' }

      mockRolesService.assignPermission.mockResolvedValue(expected)

      const result = await controller.assignPermission('role-1', dto as any)

      expect(result).toEqual(expected)
      expect(mockRolesService.assignPermission).toHaveBeenCalledWith(
        'role-1',
        'perm-1',
      )
    })
  })

  describe('removePermission', () => {
    it('should remove a permission from a role', async () => {
      mockRolesService.removePermission.mockResolvedValue(undefined)

      await controller.removePermission('role-1', 'perm-1')

      expect(mockRolesService.removePermission).toHaveBeenCalledWith(
        'role-1',
        'perm-1',
      )
    })
  })
})
