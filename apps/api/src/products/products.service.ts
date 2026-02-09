import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Prisma } from '@/generated/prisma/client'
import { PrismaService } from '@/prisma'

import {
  CreateProductDto,
  CreateProductImageDto,
  CreateProductVariantDto,
  ProductQueryDto,
  UpdateProductDto,
  UpdateProductVariantDto,
} from './dto'

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    })

    if (existing) {
      throw new ConflictException('Product slug already in use')
    }

    return this.prisma.product.create({
      data: dto,
      include: {
        vendor: { select: { id: true, name: true, slug: true } },
        category: true,
        variants: true,
        images: { orderBy: { position: 'asc' } },
      },
    })
  }

  async findAll(query: ProductQueryDto) {
    const where: Prisma.ProductWhereInput = {}

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    if (query.categoryId) where.categoryId = query.categoryId

    if (query.vendorId) where.vendorId = query.vendorId

    if (query.status) where.status = query.status

    if (query.filamentType) where.filamentType = query.filamentType

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }

    if (query.sortBy === 'name') orderBy = { name: 'asc' }

    if (query.sortBy === 'newest') orderBy = { createdAt: 'desc' }

    if (query.sortBy === 'oldest') orderBy = { createdAt: 'asc' }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        include: {
          vendor: { select: { id: true, name: true, slug: true } },
          category: true,
          variants: true,
          images: { orderBy: { position: 'asc' }, take: 1 },
          _count: { select: { reviews: true, variants: true } },
        },
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ])

    return {
      items: products,
      total,
      page: query.page!,
      limit: query.limit!,
      totalPages: Math.ceil(total / query.limit!),
    }
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        vendor: { select: { id: true, name: true, slug: true } },
        category: true,
        variants: { orderBy: { createdAt: 'asc' } },
        images: { orderBy: { position: 'asc' } },
        reviews: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    const avgRating = await this.prisma.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
    })

    return { ...product, averageRating: avgRating._avg.rating ?? 0 }
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id)

    if (dto.slug) {
      const existing = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      })

      if (existing && existing.id !== id) {
        throw new ConflictException('Product slug already in use')
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        vendor: { select: { id: true, name: true, slug: true } },
        category: true,
        variants: true,
        images: { orderBy: { position: 'asc' } },
      },
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.product.delete({ where: { id } })
  }

  // Variants
  async addVariant(productId: string, dto: CreateProductVariantDto) {
    await this.findOne(productId)
    const existing = await this.prisma.productVariant.findUnique({
      where: { sku: dto.sku },
    })

    if (existing) {
      throw new ConflictException('Variant SKU already in use')
    }

    return this.prisma.productVariant.create({
      data: { ...dto, productId },
    })
  }

  async updateVariant(
    productId: string,
    variantId: string,
    dto: UpdateProductVariantDto,
  ) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, productId },
    })

    if (!variant) {
      throw new NotFoundException('Variant not found')
    }

    if (dto.sku) {
      const existing = await this.prisma.productVariant.findUnique({
        where: { sku: dto.sku },
      })

      if (existing && existing.id !== variantId) {
        throw new ConflictException('Variant SKU already in use')
      }
    }

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: dto,
    })
  }

  async removeVariant(productId: string, variantId: string) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, productId },
    })

    if (!variant) {
      throw new NotFoundException('Variant not found')
    }

    return this.prisma.productVariant.delete({ where: { id: variantId } })
  }

  // Images
  async addImage(productId: string, dto: CreateProductImageDto) {
    await this.findOne(productId)

    return this.prisma.productImage.create({
      data: { ...dto, productId },
    })
  }

  async updateImage(
    productId: string,
    imageId: string,
    dto: Partial<CreateProductImageDto>,
  ) {
    const image = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId },
    })

    if (!image) {
      throw new NotFoundException('Image not found')
    }

    return this.prisma.productImage.update({
      where: { id: imageId },
      data: dto,
    })
  }

  async removeImage(productId: string, imageId: string) {
    const image = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId },
    })

    if (!image) {
      throw new NotFoundException('Image not found')
    }

    return this.prisma.productImage.delete({ where: { id: imageId } })
  }
}
