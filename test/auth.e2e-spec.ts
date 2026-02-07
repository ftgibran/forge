import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '../src/prisma/prisma.service.js'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestApp } from './setup-app.js'

let app: INestApplication
let prisma: PrismaService

describe('Auth (e2e)', () => {
  beforeAll(async () => {
    app = await createTestApp()
    prisma = app.get(PrismaService)

    // Clean up test data
    await prisma.userPermission.deleteMany()
    await prisma.userRole.deleteMany()
    await prisma.rolePermission.deleteMany()
    await prisma.user.deleteMany()
    await prisma.role.deleteMany()
    await prisma.permission.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  let accessToken: string

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'e2e-test@example.com',
          password: 'password123',
          name: 'E2E Test User',
        })
        .expect(201)

      expect(res.body.data.accessToken).toBeDefined()
      expect(res.body.data.user.email).toBe('e2e-test@example.com')
      accessToken = res.body.data.accessToken as string
    })

    it('should fail with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'e2e-test@example.com',
          password: 'password123',
          name: 'Duplicate User',
        })
        .expect(409)
    })

    it('should fail with invalid email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'not-an-email',
          password: 'password123',
          name: 'Bad Email User',
        })
        .expect(400)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'e2e-test@example.com',
          password: 'password123',
        })
        .expect(201)

      expect(res.body.data.accessToken).toBeDefined()
      accessToken = res.body.data.accessToken as string
    })

    it('should fail with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'e2e-test@example.com',
          password: 'wrongpassword',
        })
        .expect(401)
    })
  })

  describe('GET /api/auth/me', () => {
    it('should return profile for authenticated user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(res.body.data.email).toBe('e2e-test@example.com')
      expect(res.body.data).not.toHaveProperty('password')
    })

    it('should fail without auth token', async () => {
      await request(app.getHttpServer()).get('/api/auth/me').expect(401)
    })
  })
})
