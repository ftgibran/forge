import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { PrismaService } from '@/prisma'

import { createTestApp } from './setup-app'

let app: INestApplication
let prisma: PrismaService
let adminToken: string
let createdVendorId: string

describe('Vendors (e2e)', () => {
  beforeAll(async () => {
    app = await createTestApp()
    prisma = app.get(PrismaService)

    await prisma.userPermission.deleteMany()
    await prisma.userRole.deleteMany()
    await prisma.rolePermission.deleteMany()
    await prisma.vendorApplication.deleteMany()
    await prisma.vendor.deleteMany()
    await prisma.user.deleteMany()
    await prisma.role.deleteMany()
    await prisma.permission.deleteMany()

    const perms = await Promise.all([
      prisma.permission.create({
        data: { action: 'read', resource: 'vendor' },
      }),
      prisma.permission.create({
        data: { action: 'delete', resource: 'vendor' },
      }),
      prisma.permission.create({
        data: { action: 'read', resource: 'vendor-application' },
      }),
      prisma.permission.create({
        data: { action: 'update', resource: 'vendor-application' },
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
        email: 'admin-vendors-e2e@example.com',
        password: hashedPassword,
        name: 'Admin',
      },
    })

    await prisma.userRole.create({
      data: { userId: adminUser.id, roleId: adminRole.id },
    })

    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin-vendors-e2e@example.com', password: 'admin123' })

    adminToken = res.body.data.accessToken as string
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/vendors', () => {
    it('should create a vendor for the current user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/vendors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Dragon Prints Co.', slug: 'dragon-prints-co' })
        .expect(201)

      expect(res.body.data.name).toBe('Dragon Prints Co.')
      createdVendorId = res.body.data.id as string
    })
  })

  describe('GET /api/vendors', () => {
    it('should return paginated vendors', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/vendors')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('GET /api/vendors/me', () => {
    it('should return the current user vendor', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/vendors/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.data.name).toBe('Dragon Prints Co.')
    })
  })

  describe('GET /api/vendors/:id', () => {
    it('should return a vendor by id (public)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/vendors/${createdVendorId}`)
        .expect(200)

      expect(res.body.data.name).toBe('Dragon Prints Co.')
    })
  })

  describe('PATCH /api/vendors/:id', () => {
    it('should update a vendor', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/vendors/${createdVendorId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Dragon Prints Studio' })
        .expect(200)

      expect(res.body.data.name).toBe('Dragon Prints Studio')
    })
  })

  describe('GET /api/vendor-applications', () => {
    it('should return paginated vendor applications', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/vendor-applications')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.data.items).toBeDefined()
    })
  })

  describe('DELETE /api/vendors/:id', () => {
    it('should delete a vendor', async () => {
      await request(app.getHttpServer())
        .delete(`/api/vendors/${createdVendorId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })
  })
})
