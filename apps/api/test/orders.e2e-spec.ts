import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { PrismaService } from '@/prisma'

import { createTestApp } from './setup-app'

let app: INestApplication
let prisma: PrismaService
let userToken: string
let adminToken: string
let createdOrderId: string
let variantId: string

describe('Orders (e2e)', () => {
  beforeAll(async () => {
    app = await createTestApp()
    prisma = app.get(PrismaService)

    await prisma.userPermission.deleteMany()
    await prisma.userRole.deleteMany()
    await prisma.rolePermission.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.review.deleteMany()
    await prisma.productVariant.deleteMany()
    await prisma.product.deleteMany()
    await prisma.vendorApplication.deleteMany()
    await prisma.vendor.deleteMany()
    await prisma.user.deleteMany()
    await prisma.role.deleteMany()
    await prisma.permission.deleteMany()

    const perms = await Promise.all([
      prisma.permission.create({ data: { action: 'read', resource: 'order' } }),
      prisma.permission.create({
        data: { action: 'update', resource: 'order' },
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

    const hashedPassword = await bcrypt.hash('pass123', 10)

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin-orders-e2e@example.com',
        password: hashedPassword,
        name: 'Admin',
      },
    })

    await prisma.userRole.create({
      data: { userId: adminUser.id, roleId: adminRole.id },
    })

    const _regularUser = await prisma.user.create({
      data: {
        email: 'user-orders-e2e@example.com',
        password: hashedPassword,
        name: 'User',
      },
    })

    const vendor = await prisma.vendor.create({
      data: {
        name: 'Order Vendor',
        slug: 'order-vendor',
        ownerId: adminUser.id,
      },
    })

    const product = await prisma.product.create({
      data: {
        name: 'Order Product',
        slug: 'order-product',
        vendorId: vendor.id,
      },
    })

    const variant = await prisma.productVariant.create({
      data: {
        name: 'Standard',
        sku: 'ORD-001',
        price: 24.99,
        productId: product.id,
        stock: 50,
      },
    })

    variantId = variant.id

    // Add item to cart
    await request(app.getHttpServer())
      .post('/api/cart/items')
      .send({ variantId, quantity: 1 })

    // Login both users
    const adminRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin-orders-e2e@example.com', password: 'pass123' })

    adminToken = adminRes.body.data.accessToken as string

    const userRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'user-orders-e2e@example.com', password: 'pass123' })

    userToken = userRes.body.data.accessToken as string

    // Add item to regular user cart
    await request(app.getHttpServer())
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ variantId, quantity: 1 })
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/orders/checkout', () => {
    it('should checkout and create an order', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/orders/checkout')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          shippingAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'US',
          },
        })
        .expect(201)

      expect(res.body.data.id).toBeDefined()
      createdOrderId = res.body.data.id as string
    })
  })

  describe('GET /api/orders', () => {
    it('should return paginated orders (admin)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('GET /api/orders/my', () => {
    it('should return orders for the current user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/orders/my')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)

      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('GET /api/orders/:id', () => {
    it('should return an order by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)

      expect(res.body.data.id).toBe(createdOrderId)
    })
  })

  describe('PATCH /api/orders/:id/status', () => {
    it('should update the order status', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/orders/${createdOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'PROCESSING' })
        .expect(200)

      expect(res.body.data.status).toBe('PROCESSING')
    })
  })
})
