import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PaginationQueryDto } from '@/common'
import { PrismaService } from '@/prisma'

import { CreateReviewDto, UpdateReviewDto } from './dto'

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReviewDto, userId: string) {
    // Verify user has a DELIVERED order containing this product
    const deliveredOrder = await this.prisma.orderItem.findFirst({
      where: {
        productId: dto.productId,
        order: {
          userId,
          status: 'DELIVERED',
        },
      },
    })

    if (!deliveredOrder) {
      throw new BadRequestException(
        'You can only review products from delivered orders',
      )
    }

    // Check if user already reviewed this product
    const existing = await this.prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId: dto.productId },
      },
    })

    if (existing) {
      throw new BadRequestException('You have already reviewed this product')
    }

    return this.prisma.review.create({
      data: { ...dto, userId },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    })
  }

  async findByProduct(productId: string, query: PaginationQueryDto) {
    const where = { productId }
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        include: {
          user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where }),
    ])

    return {
      items: reviews,
      total,
      page: query.page!,
      limit: query.limit!,
      totalPages: Math.ceil(total / query.limit!),
    }
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    })

    if (!review) {
      throw new NotFoundException('Review not found')
    }

    return review
  }

  async update(id: string, dto: UpdateReviewDto, userId: string) {
    const review = await this.findOne(id)

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews')
    }

    return this.prisma.review.update({
      where: { id },
      data: dto,
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    })
  }

  async remove(id: string, userId?: string) {
    const review = await this.findOne(id)

    if (userId && review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews')
    }

    return this.prisma.review.delete({ where: { id } })
  }
}
