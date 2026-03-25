import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { PrismaService } from '@/prisma'

import { createTestApp } from './setup-app'

let app: INestApplication
let prisma: PrismaService
let adminToken: string
let createdPermissionId: string

describe('Permissions (e2e)', () => {
  beforeAll(async () => {
    app = await createTestApp()
    prisma = app.get(PrismaService)

    // Clean up
    await prisma.userPermission.deleteMany()
    await prisma.userRole.deleteMany()
    await prisma.rolePermission.deleteMany()
    await prisma.user.deleteMany()
    await prisma.role.deleteMany()
    await prisma.permission.deleteMany()

    // Seed admin permissions
    const perms = await Promise.all([
      prisma.permission.create({
        data: { action: 'create', resource: 'permission' },
      }),
      prisma.permission.create({
        data: { action: 'read', resource: 'permission' },
      }),
      prisma.permission.create({
        data: { action: 'update', resource: 'permission' },
      }),
      prisma.permission.create({
        data: { action: 'delete', resource: 'permission' },
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
        email: 'admin-permissions-e2e@example.com',
        password: hashedPassword,
        name: 'Admin',
      },
    })

    await prisma.userRole.create({
      data: { userId: adminUser.id, roleId: adminRole.id },
    })

    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin-permissions-e2e@example.com',
        password: 'admin123',
      })

    adminToken = res.body.data.accessToken as string
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/permissions', () => {
    it('should create a permission', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/permissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ action: 'manage', resource: 'dashboard' })
        .expect(201)

      expect(res.body.data.action).toBe('manage')
      expect(res.body.data.resource).toBe('dashboard')
      createdPermissionId = res.body.data.id as string
    })
  })

  describe('GET /api/permissions', () => {
    it('should return paginated permissions', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/permissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('GET /api/permissions/:id', () => {
    it('should return a permission by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/permissions/${createdPermissionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.data.action).toBe('manage')
    })
  })

  describe('PATCH /api/permissions/:id', () => {
    it('should update a permission', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/permissions/${createdPermissionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ action: 'view' })
        .expect(200)

      expect(res.body.data.action).toBe('view')
    })
  })

  describe('DELETE /api/permissions/:id', () => {
    it('should delete a permission', async () => {
      await request(app.getHttpServer())
        .delete(`/api/permissions/${createdPermissionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })
  })
})
