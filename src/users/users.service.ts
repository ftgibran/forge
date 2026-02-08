import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '@/prisma'
import { CreateUserDto, UpdateUserDto } from './dto'
import { PaginationQueryDto } from '@/common'

const userSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} as const

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (existing) {
      throw new ConflictException('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    return this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
      select: userSelect,
    })
  }

  async findAll(query: PaginationQueryDto) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: query.skip,
        take: query.limit,
        select: userSelect,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ])

    return {
      items: users,
      total,
      page: query.page!,
      limit: query.limit!,
      totalPages: Math.ceil(total / query.limit!),
    }
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...userSelect,
        userRoles: { include: { role: true } },
        userPermissions: { include: { permission: true } },
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id)

    const data: Record<string, unknown> = { ...dto }
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10)
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.user.delete({ where: { id }, select: userSelect })
  }

  async assignRole(userId: string, roleId: string) {
    await this.findOne(userId)
    return this.prisma.userRole.create({
      data: { userId, roleId },
      include: { role: true },
    })
  }

  async removeRole(userId: string, roleId: string) {
    return this.prisma.userRole.delete({
      where: { userId_roleId: { userId, roleId } },
    })
  }

  async assignPermission(userId: string, permissionId: string) {
    await this.findOne(userId)
    return this.prisma.userPermission.create({
      data: { userId, permissionId },
      include: { permission: true },
    })
  }

  async removePermission(userId: string, permissionId: string) {
    return this.prisma.userPermission.delete({
      where: { userId_permissionId: { userId, permissionId } },
    })
  }
}
