import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { PrismaService } from '@/prisma'

import { createTestApp } from './setup-app'

let app: INestApplication
let prisma: PrismaService
let adminToken: string
let createdCategoryId: string

describe('Categories (e2e)', () => {
  beforeAll(async () => {
    app = await createTestApp()
    prisma = app.get(PrismaService)

    await prisma.userPermission.deleteMany()
    await prisma.userRole.deleteMany()
    await prisma.rolePermission.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
    await prisma.role.deleteMany()
    await prisma.permission.deleteMany()

    const perms = await Promise.all([
      prisma.permission.create({
        data: { action: 'create', resource: 'category' },
      }),
      prisma.permission.create({
        data: { action: 'update', resource: 'category' },
      }),
      prisma.permission.create({
        data: { action: 'delete', resource: 'category' },
      }),
    ])

    const adminRole = await prisma.role.create({
      data: { name: 'admin', description: 'Admin' },
    })

    for (const p of perms) {
      await prisma.rolePermission.create({
        data: { roleId: adminRole.id, permissionId: p.id },
      })
    }

    const hashedPassword = await bcrypt.hash('admin123', 10)
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin-categories-e2e@example.com',
        password: hashedPassword,
        name: 'Admin',
      },
    })

    await prisma.userRole.create({
      data: { userId: adminUser.id, roleId: adminRole.id },
    })

    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin-categories-e2e@example.com', password: 'admin123' })

    adminToken = res.body.data.accessToken as string
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/categories', () => {
    it('should create a category', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Electronics', slug: 'electronics' })
        .expect(201)

      expect(res.body.data.name).toBe('Electronics')
      createdCategoryId = res.body.data.id as string
    })
  })

  describe('GET /api/categories', () => {
    it('should return all categories (public)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/categories')
        .expect(200)

      expect(Array.isArray(res.body.data)).toBe(true)
      expect(res.body.data.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('GET /api/categories/:id', () => {
    it('should return a category by id (public)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/categories/${createdCategoryId}`)
        .expect(200)

      expect(res.body.data.name).toBe('Electronics')
    })
  })

  describe('PATCH /api/categories/:id', () => {
    it('should update a category', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Electronics & Gadgets' })
        .expect(200)

      expect(res.body.data.name).toBe('Electronics & Gadgets')
    })
  })

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      await request(app.getHttpServer())
        .delete(`/api/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })
  })
})
