import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { PrismaService } from '@/prisma'

import { createTestApp } from './setup-app'

let app: INestApplication
let prisma: PrismaService
let adminToken: string
let seededMediaId: number

describe('Media (e2e)', () => {
  beforeAll(async () => {
    app = await createTestApp()
    prisma = app.get(PrismaService)

    await prisma.userPermission.deleteMany()
    await prisma.userRole.deleteMany()
    await prisma.rolePermission.deleteMany()
    await prisma.productImage.deleteMany()
    await prisma.vendor.deleteMany()
    await prisma.media.deleteMany()
    await prisma.user.deleteMany()
    await prisma.role.deleteMany()
    await prisma.permission.deleteMany()

    const adminRole = await prisma.role.create({
      data: { name: 'admin', description: 'Admin' },
    })

    const hashedPassword = await bcrypt.hash('admin123', 10)
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin-media-e2e@example.com',
        password: hashedPassword,
        name: 'Admin',
      },
    })

    await prisma.userRole.create({
      data: { userId: adminUser.id, roleId: adminRole.id },
    })

    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin-media-e2e@example.com', password: 'admin123' })

    adminToken = res.body.data.accessToken as string

    // Seed a media record directly via Prisma (S3 upload is not tested in e2e)
    const seededMedia = await prisma.media.create({
      data: {
        filename: 'test-image.webp',
        url: 'https://cdn.example.com/test-bucket/media/test-uuid/original.webp',
        mimeType: 'image/webp',
        filesize: 50000,
        width: 800,
        height: 600,
        sizes: {
          thumbnail: {
            url: 'https://cdn.example.com/test-bucket/media/test-uuid/thumbnail.webp',
            width: 300,
            height: 225,
          },
        },
        alt: 'Test image',
      },
    })

    seededMediaId = seededMedia.id
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /api/media', () => {
    it('should return paginated media list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/media')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1)
      expect(res.body.data.total).toBeGreaterThanOrEqual(1)
    })
  })

  describe('GET /api/media/:id', () => {
    it('should return media by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/media/${seededMediaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.data.filename).toBe('test-image.webp')
      expect(res.body.data.alt).toBe('Test image')
    })

    it('should return 404 for non-existent media', async () => {
      await request(app.getHttpServer())
        .get('/api/media/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)
    })
  })

  describe('PATCH /api/media/:id', () => {
    it('should update media alt text', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/media/${seededMediaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ alt: 'Updated alt text' })
        .expect(200)

      expect(res.body.data.alt).toBe('Updated alt text')
    })
  })

  describe('DELETE /api/media/:id', () => {
    it('should delete a media record', async () => {
      // Note: upload (POST /api/media) is not tested in e2e because it requires a real S3 connection.
      // The upload logic is fully covered by media.service.spec.ts unit tests.
      await request(app.getHttpServer())
        .delete(`/api/media/${seededMediaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204)
    })
  })
})
