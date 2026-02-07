import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller.js'
import { UsersService } from './users.service.js'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockUsersService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  assignRole: vi.fn(),
  removeRole: vi.fn(),
  assignPermission: vi.fn(),
  removePermission: vi.fn(),
}

describe('UsersController', () => {
  let controller: UsersController

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  describe('create', () => {
    it('should create a user', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
      }
      const expected = { id: '1', email: 'test@example.com', name: 'Test' }
      mockUsersService.create.mockResolvedValue(expected)

      const result = await controller.create(dto)
      expect(result).toEqual(expected)
      expect(mockUsersService.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const expected = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      }
      mockUsersService.findAll.mockResolvedValue(expected)

      const result = await controller.findAll({
        page: 1,
        limit: 10,
        get skip() {
          return 0
        },
      })
      expect(result).toEqual(expected)
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const expected = { id: '1', email: 'test@example.com', name: 'Test' }
      mockUsersService.findOne.mockResolvedValue(expected)

      const result = await controller.findOne('1')
      expect(result).toEqual(expected)
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const dto = { name: 'Updated' }
      const expected = { id: '1', email: 'test@example.com', name: 'Updated' }
      mockUsersService.update.mockResolvedValue(expected)

      const result = await controller.update('1', dto)
      expect(result).toEqual(expected)
    })
  })

  describe('remove', () => {
    it('should delete a user', async () => {
      const expected = { id: '1', email: 'test@example.com', name: 'Test' }
      mockUsersService.remove.mockResolvedValue(expected)

      const result = await controller.remove('1')
      expect(result).toEqual(expected)
    })
  })

  describe('assignRole', () => {
    it('should assign a role to a user', async () => {
      const expected = { userId: '1', roleId: 'role-1' }
      mockUsersService.assignRole.mockResolvedValue(expected)

      const result = await controller.assignRole('1', { roleId: 'role-1' })
      expect(result).toEqual(expected)
    })
  })
})
