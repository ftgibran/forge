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
let productId: string
let createdReviewId: string

describe('Reviews (e2e)', () => {
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

    const deletePerm = await prisma.permission.create({
      data: { action: 'delete', resource: 'review' },
    })

    const adminRole = await prisma.role.create({
      data: { name: 'admin', description: 'Admin' },
    })

    await prisma.rolePermission.create({
      data: { roleId: adminRole.id, permissionId: deletePerm.id },
    })

    const hashedPassword = await bcrypt.hash('pass123', 10)

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin-reviews-e2e@example.com',
        password: hashedPassword,
        name: 'Admin',
      },
    })

    await prisma.userRole.create({
      data: { userId: adminUser.id, roleId: adminRole.id },
    })

    const _regularUser = await prisma.user.create({
      data: {
        email: 'user-reviews-e2e@example.com',
        password: hashedPassword,
        name: 'User',
      },
    })

    const vendor = await prisma.vendor.create({
      data: {
        name: 'Review Vendor',
        slug: 'review-vendor',
        ownerId: adminUser.id,
      },
    })

    const product = await prisma.product.create({
      data: {
        name: 'Review Product',
        slug: 'review-product',
        vendorId: vendor.id,
      },
    })

    productId = product.id

    const adminRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin-reviews-e2e@example.com', password: 'pass123' })

    adminToken = adminRes.body.data.accessToken as string

    const userRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'user-reviews-e2e@example.com', password: 'pass123' })

    userToken = userRes.body.data.accessToken as string
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/reviews', () => {
    it('should create a review', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/reviews')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId,
          rating: 5,
          title: 'Amazing!',
          comment: 'Perfect print quality.',
        })
        .expect(201)

      expect(res.body.data.rating).toBe(5)
      createdReviewId = res.body.data.id as string
    })
  })

  describe('GET /api/reviews/product/:productId', () => {
    it('should return reviews for a product (public)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/reviews/product/${productId}`)
        .expect(200)

      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('GET /api/reviews/:id', () => {
    it('should return a review by id (public)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/reviews/${createdReviewId}`)
        .expect(200)

      expect(res.body.data.rating).toBe(5)
    })
  })

  describe('PATCH /api/reviews/:id', () => {
    it('should update a review', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/reviews/${createdReviewId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ comment: 'Updated: still amazing!' })
        .expect(200)

      expect(res.body.data.comment).toBe('Updated: still amazing!')
    })
  })

  describe('DELETE /api/reviews/:id', () => {
    it('should delete a review', async () => {
      await request(app.getHttpServer())
        .delete(`/api/reviews/${createdReviewId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })
  })
})
