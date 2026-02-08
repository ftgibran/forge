import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@/prisma'
import { CreatePermissionDto, UpdatePermissionDto } from './dto'
import { PaginationQueryDto } from '@/common'

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePermissionDto) {
    const existing = await this.prisma.permission.findUnique({
      where: {
        action_resource: { action: dto.action, resource: dto.resource },
      },
    })

    if (existing) {
      throw new ConflictException('Permission already exists')
    }

    return this.prisma.permission.create({ data: dto })
  }

  async findAll(query: PaginationQueryDto) {
    const [permissions, total] = await Promise.all([
      this.prisma.permission.findMany({
        skip: query.skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.permission.count(),
    ])

    return {
      items: permissions,
      total,
      page: query.page!,
      limit: query.limit!,
      totalPages: Math.ceil(total / query.limit!),
    }
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    })

    if (!permission) {
      throw new NotFoundException('Permission not found')
    }

    return permission
  }

  async update(id: string, dto: UpdatePermissionDto) {
    await this.findOne(id)
    return this.prisma.permission.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.permission.delete({ where: { id } })
  }
}
