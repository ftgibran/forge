import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma'
import { AddCartItemDto, UpdateCartItemDto } from './dto'

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    })
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      })
    }
    return cart
  }

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    vendorId: true,
                    images: { orderBy: { position: 'asc' }, take: 1 },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!cart) {
      return { items: [] }
    }

    return cart
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.getOrCreateCart(userId)

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: dto.variantId },
    })
    if (!variant) {
      throw new NotFoundException('Product variant not found')
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_variantId: { cartId: cart.id, variantId: dto.variantId },
      },
    })

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
        include: { variant: { include: { product: true } } },
      })
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId: dto.variantId,
        quantity: dto.quantity,
      },
      include: { variant: { include: { product: true } } },
    })
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } })
    if (!cart) {
      throw new NotFoundException('Cart not found')
    }

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    })
    if (!item) {
      throw new NotFoundException('Cart item not found')
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
      include: { variant: { include: { product: true } } },
    })
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } })
    if (!cart) {
      throw new NotFoundException('Cart not found')
    }

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    })
    if (!item) {
      throw new NotFoundException('Cart item not found')
    }

    return this.prisma.cartItem.delete({ where: { id: itemId } })
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } })
    if (!cart) {
      return { count: 0 }
    }

    return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  }
}
