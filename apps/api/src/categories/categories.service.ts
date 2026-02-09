import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '@/prisma'

import { CreateCategoryDto, UpdateCategoryDto } from './dto'

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    })

    if (existing) {
      throw new ConflictException('Category slug already in use')
    }

    return this.prisma.category.create({ data: dto })
  }

  async findAll() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: { _count: { select: { products: true } } },
        },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    })
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          include: { _count: { select: { products: true } } },
        },
        parent: true,
        _count: { select: { products: true } },
      },
    })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return category
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id)

    if (dto.slug) {
      const existing = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      })

      if (existing && existing.id !== id) {
        throw new ConflictException('Category slug already in use')
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.category.delete({ where: { id } })
  }
}
