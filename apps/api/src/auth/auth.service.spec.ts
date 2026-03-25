import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PrismaService } from '@/prisma'

import { AuthService } from './auth.service'

const mockPrismaService = {
  user: {
    findUnique: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    create: vi.fn(),
  },
}

const mockJwtService = {
  sign: vi.fn().mockReturnValue('mock-jwt-token'),
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  describe('register', () => {
    it('should register a new user and return token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)
      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed',
      })

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      })

      expect(result.accessToken).toBe('mock-jwt-token')
      expect(result.user.email).toBe('test@example.com')
    })

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
      })

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('login', () => {
    it('should login and return token for valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        userRoles: [],
      })

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.accessToken).toBe('mock-jwt-token')
      expect(result.user.email).toBe('test@example.com')
    })

    it('should throw UnauthorizedException for invalid password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
      })

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(
        service.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      mockPrismaService.user.findUniqueOrThrow.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed',
        userRoles: [],
        userPermissions: [],
      })

      const result = await service.getProfile('1')

      expect(result).not.toHaveProperty('password')
      expect(result.email).toBe('test@example.com')
    })
  })
})
