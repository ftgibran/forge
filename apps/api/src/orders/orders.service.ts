import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PaginationQueryDto } from '@/common'
import { PrismaService } from '@/prisma'

import { CreateOrderDto, UpdateOrderStatusDto } from './dto'

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { select: { id: true, vendorId: true } },
              },
            },
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty')
    }

    // Group items by vendor
    const itemsByVendor = new Map<string, typeof cart.items>()

    for (const item of cart.items) {
      const vendorId = item.variant.product.vendorId

      if (!itemsByVendor.has(vendorId)) {
        itemsByVendor.set(vendorId, [])
      }

      itemsByVendor.get(vendorId)!.push(item)
    }

    // Validate stock
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for variant "${item.variant.name}" (available: ${item.variant.stock})`,
        )
      }
    }

    // Create orders in a transaction
    const orders = await this.prisma.$transaction(async (tx) => {
      const createdOrders = []

      for (const [vendorId, items] of itemsByVendor) {
        const totalAmount = items.reduce(
          (sum, item) => sum + Number(item.variant.price) * item.quantity,
          0,
        )

        const order = await tx.order.create({
          data: {
            userId,
            vendorId,
            totalAmount,
            shippingAddress: dto.shippingAddress as never,
            items: {
              create: items.map((item) => ({
                variantId: item.variantId,
                productId: item.variant.product.id,
                quantity: item.quantity,
                unitPrice: item.variant.price,
              })),
            },
          },
          include: {
            items: {
              include: {
                variant: true,
                product: { select: { id: true, name: true } },
              },
            },
            vendor: { select: { id: true, name: true } },
          },
        })

        // Decrement stock
        for (const item of items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          })
        }

        createdOrders.push(order)
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

      return createdOrders
    })

    return orders
  }

  async findAll(query: PaginationQueryDto) {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip: query.skip,
        take: query.limit,
        include: {
          user: { select: { id: true, email: true, name: true } },
          vendor: { select: { id: true, name: true } },
          _count: { select: { items: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count(),
    ])

    return {
      items: orders,
      total,
      page: query.page!,
      limit: query.limit!,
      totalPages: Math.ceil(total / query.limit!),
    }
  }

  async findMyOrders(userId: string, query: PaginationQueryDto) {
    const where = { userId }
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        include: {
          vendor: { select: { id: true, name: true } },
          items: {
            include: {
              variant: true,
              product: { select: { id: true, name: true, slug: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ])

    return {
      items: orders,
      total,
      page: query.page!,
      limit: query.limit!,
      totalPages: Math.ceil(total / query.limit!),
    }
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        vendor: { select: { id: true, name: true } },
        items: {
          include: {
            variant: true,
            product: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    return order
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    await this.findOne(id)

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: {
        user: { select: { id: true, email: true, name: true } },
        vendor: { select: { id: true, name: true } },
      },
    })
  }
}
