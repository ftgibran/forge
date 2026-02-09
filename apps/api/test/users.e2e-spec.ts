import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { PrismaService } from '@/prisma'

import { createTestApp } from './setup-app'

let app: INestApplication
let prisma: PrismaService
let adminToken: string
let createdUserId: string
let roleId: string
let permissionId: string

describe('Users (e2e)', () => {
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

    // Create permissions for users
    const perm = await prisma.permission.create({
      data: {
        action: 'create',
        resource: 'user',
        description: 'Can create user',
      },
    })

    permissionId = perm.id

    await prisma.permission.createMany({
      data: [
        { action: 'read', resource: 'user' },
        { action: 'update', resource: 'user' },
        { action: 'delete', resource: 'user' },
      ],
    })

    const allPerms = await prisma.permission.findMany()

    // Create admin role with all perms
    const role = await prisma.role.create({
      data: { name: 'admin', description: 'Admin' },
    })

    roleId = role.id

    for (const p of allPerms) {
      await prisma.rolePermission.create({
        data: { roleId: role.id, permissionId: p.id },
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin-e2e@example.com',
        password: hashedPassword,
        name: 'Admin',
      },
    })

    await prisma.userRole.create({
      data: { userId: adminUser.id, roleId: role.id },
    })

    // Login to get token
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin-e2e@example.com', password: 'admin123' })

    adminToken = res.body.data.accessToken as string
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/users', () => {
    it('should create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        })
        .expect(201)

      expect(res.body.data.email).toBe('newuser@example.com')
      createdUserId = res.body.data.id as string
    })

    it('should fail without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'another@example.com',
          password: 'password123',
          name: 'Another User',
        })
        .expect(401)
    })
  })

  describe('GET /api/users', () => {
    it('should return paginated users', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.data.items).toBeDefined()
      expect(res.body.data.total).toBeGreaterThanOrEqual(1)
    })
  })

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.data.id).toBe(createdUserId)
    })
  })

  describe('PATCH /api/users/:id', () => {
    it('should update a user', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' })
        .expect(200)

      expect(res.body.data.name).toBe('Updated Name')
    })
  })

  describe('POST /api/users/:id/roles', () => {
    it('should assign a role to a user', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/users/${createdUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ roleId })
        .expect(201)

      expect(res.body.data.roleId).toBe(roleId)
    })
  })

  describe('DELETE /api/users/:id/roles/:roleId', () => {
    it('should remove a role from a user', async () => {
      await request(app.getHttpServer())
        .delete(`/api/users/${createdUserId}/roles/${roleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })
  })

  describe('POST /api/users/:id/permissions', () => {
    it('should assign a permission to a user', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/users/${createdUserId}/permissions`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ permissionId })
        .expect(201)

      expect(res.body.data.permissionId).toBe(permissionId)
    })
  })

  describe('DELETE /api/users/:id/permissions/:permissionId', () => {
    it('should remove a permission from a user', async () => {
      await request(app.getHttpServer())
        .delete(`/api/users/${createdUserId}/permissions/${permissionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })
  })

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      await request(app.getHttpServer())
        .delete(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })
  })
})
