import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PermissionsController } from './permissions.controller'
import { PermissionsService } from './permissions.service'

const mockPermissionsService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}

describe('PermissionsController', () => {
  let controller: PermissionsController

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        { provide: PermissionsService, useValue: mockPermissionsService },
      ],
    }).compile()

    controller = module.get<PermissionsController>(PermissionsController)
  })

  describe('create', () => {
    it('should create a permission', async () => {
      const dto = { action: 'read', resource: 'product' }
      const expected = { id: 'perm-1', action: 'read', resource: 'product' }

      mockPermissionsService.create.mockResolvedValue(expected)

      const result = await controller.create(dto as any)

      expect(result).toEqual(expected)
      expect(mockPermissionsService.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('findAll', () => {
    it('should return paginated permissions', async () => {
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

      mockPermissionsService.findAll.mockResolvedValue(expected)

      const result = await controller.findAll(query as any)

      expect(result).toEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a permission by id', async () => {
      const expected = { id: 'perm-1', action: 'read', resource: 'product' }

      mockPermissionsService.findOne.mockResolvedValue(expected)

      const result = await controller.findOne('perm-1')

      expect(result).toEqual(expected)
    })
  })

  describe('update', () => {
    it('should update a permission', async () => {
      const dto = { action: 'write' }
      const expected = { id: 'perm-1', action: 'write', resource: 'product' }

      mockPermissionsService.update.mockResolvedValue(expected)

      const result = await controller.update('perm-1', dto as any)

      expect(result).toEqual(expected)
      expect(mockPermissionsService.update).toHaveBeenCalledWith('perm-1', dto)
    })
  })

  describe('remove', () => {
    it('should delete a permission', async () => {
      const expected = { id: 'perm-1', action: 'read', resource: 'product' }

      mockPermissionsService.remove.mockResolvedValue(expected)

      const result = await controller.remove('perm-1')

      expect(result).toEqual(expected)
    })
  })
})
