import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { PrismaService } from '@/prisma'

import { createTestApp } from './setup-app'

let app: INestApplication
let prisma: PrismaService
let adminToken: string
let createdRoleId: string
let permissionId: string

describe('Roles (e2e)', () => {
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

    // Create role-related permissions
    const perms = await Promise.all([
      prisma.permission.create({
        data: { action: 'create', resource: 'role' },
      }),
      prisma.permission.create({ data: { action: 'read', resource: 'role' } }),
      prisma.permission.create({
        data: { action: 'update', resource: 'role' },
      }),
      prisma.permission.create({
        data: { action: 'delete', resource: 'role' },
      }),
    ])

    // Create a separate permission to assign later
    const extraPerm = await prisma.permission.create({
      data: { action: 'read', resource: 'dashboard' },
    })

    permissionId = extraPerm.id

    // Create admin role
    const adminRole = await prisma.role.create({
      data: { name: 'admin', description: 'Admin' },
    })

    for (const p of perms) {
      await prisma.rolePermission.create({
        data: { roleId: adminRole.id, permissionId: p.id },
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin-roles-e2e@example.com',
        password: hashedPassword,
        name: 'Admin',
      },
    })

    await prisma.userRole.create({
      data: { userId: adminUser.id, roleId: adminRole.id },
    })

    // Login
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin-roles-e2e@example.com', password: 'admin123' })

    adminToken = res.body.data.accessToken as string
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/roles', () => {
    it('should create a role', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'editor', description: 'Can edit things' })
        .expect(201)

      expect(res.body.data.name).toBe('editor')
      createdRoleId = res.body.data.id as string
    })
  })

  describe('GET /api/roles', () => {
    it('should return paginated roles', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('GET /api/roles/:id', () => {
    it('should return a role by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/roles/${createdRoleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.data.name).toBe('editor')
    })
  })

  describe('PATCH /api/roles/:id', () => {
    it('should update a role', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/roles/${createdRoleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'Updated description' })
        .expect(200)

      expect(res.body.data.description).toBe('Updated description')
    })
  })

  describe('POST /api/roles/:id/permissions', () => {
    it('should assign a permission to a role', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/roles/${createdRoleId}/permissions`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ permissionId })
        .expect(201)

      expect(res.body.data.permissionId).toBe(permissionId)
    })
  })

  describe('DELETE /api/roles/:id/permissions/:permissionId', () => {
    it('should remove a permission from a role', async () => {
      await request(app.getHttpServer())
        .delete(`/api/roles/${createdRoleId}/permissions/${permissionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })
  })

  describe('DELETE /api/roles/:id', () => {
    it('should delete a role', async () => {
      await request(app.getHttpServer())
        .delete(`/api/roles/${createdRoleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })
  })
})
