import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { PrismaService } from '@/prisma'

import { createTestApp } from './setup-app'

let app: INestApplication
let prisma: PrismaService
let userToken: string
let variantId: string
let cartItemId: string

describe('Carts (e2e)', () => {
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
    await prisma.productVariant.deleteMany()
    await prisma.product.deleteMany()
    await prisma.vendorApplication.deleteMany()
    await prisma.vendor.deleteMany()
    await prisma.user.deleteMany()
    await prisma.role.deleteMany()
    await prisma.permission.deleteMany()

    const hashedPassword = await bcrypt.hash('user123', 10)
    const user = await prisma.user.create({
      data: {
        email: 'user-carts-e2e@example.com',
        password: hashedPassword,
        name: 'User',
      },
    })

    const vendor = await prisma.vendor.create({
      data: { name: 'Cart Vendor', slug: 'cart-vendor', ownerId: user.id },
    })

    const product = await prisma.product.create({
      data: { name: 'Cart Product', slug: 'cart-product', vendorId: vendor.id },
    })

    const variant = await prisma.productVariant.create({
      data: {
        name: 'Standard',
        sku: 'CART-001',
        price: 19.99,
        productId: product.id,
      },
    })

    variantId = variant.id

    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'user-carts-e2e@example.com', password: 'user123' })

    userToken = res.body.data.accessToken as string
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /api/cart', () => {
    it('should return an empty cart for new user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)

      expect(res.body.data.items).toBeDefined()
    })
  })

  describe('POST /api/cart/items', () => {
    it('should add an item to the cart', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ variantId, quantity: 2 })
        .expect(201)

      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1)
      cartItemId = res.body.data.items[0].id as string
    })
  })

  describe('PATCH /api/cart/items/:itemId', () => {
    it('should update cart item quantity', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/cart/items/${cartItemId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 })
        .expect(200)

      const item = (
        res.body.data.items as { id: string; quantity: number }[]
      ).find((i) => i.id === cartItemId)

      expect(item?.quantity).toBe(5)
    })
  })

  describe('DELETE /api/cart/items/:itemId', () => {
    it('should remove an item from the cart', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/cart/items/${cartItemId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)

      const item = (res.body.data.items as { id: string }[]).find(
        (i) => i.id === cartItemId,
      )

      expect(item).toBeUndefined()
    })
  })

  describe('DELETE /api/cart', () => {
    it('should clear the entire cart', async () => {
      // Re-add an item first
      await request(app.getHttpServer())
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ variantId, quantity: 1 })

      const res = await request(app.getHttpServer())
        .delete('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)

      expect(res.body.data.items).toHaveLength(0)
    })
  })
})
