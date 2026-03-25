import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { PrismaService } from '@/prisma'

import { createTestApp } from './setup-app'

let app: INestApplication
let prisma: PrismaService
let adminToken: string
let createdProductId: string
let createdVariantId: string
let vendorId: string

describe('Products (e2e)', () => {
  beforeAll(async () => {
    app = await createTestApp()
    prisma = app.get(PrismaService)

    await prisma.userPermission.deleteMany()
    await prisma.userRole.deleteMany()
    await prisma.rolePermission.deleteMany()
    await prisma.productImage.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.review.deleteMany()
    await prisma.productVariant.deleteMany()
    await prisma.product.deleteMany()
    await prisma.vendorApplication.deleteMany()
    await prisma.vendor.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
    await prisma.role.deleteMany()
    await prisma.permission.deleteMany()

    const perms = await Promise.all([
      prisma.permission.create({
        data: { action: 'create', resource: 'product' },
      }),
      prisma.permission.create({
        data: { action: 'update', resource: 'product' },
      }),
      prisma.permission.create({
        data: { action: 'delete', resource: 'product' },
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
        email: 'admin-products-e2e@example.com',
        password: hashedPassword,
        name: 'Admin',
      },
    })

    await prisma.userRole.create({
      data: { userId: adminUser.id, roleId: adminRole.id },
    })

    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin-products-e2e@example.com', password: 'admin123' })

    adminToken = res.body.data.accessToken as string

    // Seed vendor for product creation
    const vendor = await prisma.vendor.create({
      data: { name: 'Test Vendor', slug: 'test-vendor', ownerId: adminUser.id },
    })

    vendorId = vendor.id
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/products', () => {
    it('should create a product', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Articulated Dragon',
          slug: 'articulated-dragon',
          vendorId,
        })
        .expect(201)

      expect(res.body.data.name).toBe('Articulated Dragon')
      createdProductId = res.body.data.id as string
    })
  })

  describe('GET /api/products', () => {
    it('should return paginated products (public)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200)

      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('GET /api/products/:id', () => {
    it('should return a product by id (public)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/products/${createdProductId}`)
        .expect(200)

      expect(res.body.data.name).toBe('Articulated Dragon')
    })
  })

  describe('PATCH /api/products/:id', () => {
    it('should update a product', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Dragon' })
        .expect(200)

      expect(res.body.data.name).toBe('Updated Dragon')
    })
  })

  describe('POST /api/products/:id/variants', () => {
    it('should add a variant to a product', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/products/${createdProductId}/variants`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Standard', sku: 'DRG-001-STD', price: 29.99, stock: 10 })
        .expect(201)

      expect(res.body.data.sku).toBe('DRG-001-STD')
      createdVariantId = res.body.data.id as string
    })
  })

  describe('PATCH /api/products/:id/variants/:variantId', () => {
    it('should update a product variant', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/products/${createdProductId}/variants/${createdVariantId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 34.99 })
        .expect(200)

      expect(res.body.data.price).toBe(34.99)
    })
  })

  describe('DELETE /api/products/:id/variants/:variantId', () => {
    it('should remove a product variant', async () => {
      await request(app.getHttpServer())
        .delete(
          `/api/products/${createdProductId}/variants/${createdVariantId}`,
        )
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })
  })

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      await request(app.getHttpServer())
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })
  })
})
