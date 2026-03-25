import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

const mockAuthService = {
  register: vi.fn(),
  login: vi.fn(),
  getProfile: vi.fn(),
}

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  describe('register', () => {
    it('should register a user and return auth response', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
      }
      const expected = {
        accessToken: 'token',
        user: { id: '1', email: 'test@example.com' },
      }

      mockAuthService.register.mockResolvedValue(expected)

      const result = await controller.register(dto as any)

      expect(result).toEqual(expected)
      expect(mockAuthService.register).toHaveBeenCalledWith(dto)
    })
  })

  describe('login', () => {
    it('should login and return auth response', async () => {
      const dto = { email: 'test@example.com', password: 'password123' }
      const expected = {
        accessToken: 'token',
        user: { id: '1', email: 'test@example.com' },
      }

      mockAuthService.login.mockResolvedValue(expected)

      const result = await controller.login(dto as any)

      expect(result).toEqual(expected)
      expect(mockAuthService.login).toHaveBeenCalledWith(dto)
    })
  })

  describe('getProfile', () => {
    it('should return the profile for the given userId', async () => {
      const expected = { id: '1', email: 'test@example.com', name: 'Test' }

      mockAuthService.getProfile.mockResolvedValue(expected)

      const result = await controller.getProfile('1')

      expect(result).toEqual(expected)
      expect(mockAuthService.getProfile).toHaveBeenCalledWith('1')
    })
  })
})
