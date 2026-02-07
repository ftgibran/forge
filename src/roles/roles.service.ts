import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateRoleDto } from './dto/create-role.dto.js'
import { UpdateRoleDto } from './dto/update-role.dto.js'
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js'

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    const existing = await this.prisma.role.findUnique({
      where: { name: dto.name },
    })

    if (existing) {
      throw new ConflictException('Role name already exists')
    }

    return this.prisma.role.create({ data: dto })
  }

  async findAll(query: PaginationQueryDto) {
    const [roles, total] = await Promise.all([
      this.prisma.role.findMany({
        skip: query.skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        include: { rolePermissions: { include: { permission: true } } },
      }),
      this.prisma.role.count(),
    ])

    return {
      items: roles,
      total,
      page: query.page!,
      limit: query.limit!,
      totalPages: Math.ceil(total / query.limit!),
    }
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: { include: { permission: true } },
        userRoles: {
          include: { user: { select: { id: true, email: true, name: true } } },
        },
      },
    })

    if (!role) {
      throw new NotFoundException('Role not found')
    }

    return role
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.findOne(id)
    return this.prisma.role.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.role.delete({ where: { id } })
  }

  async assignPermission(roleId: string, permissionId: string) {
    await this.findOne(roleId)
    return this.prisma.rolePermission.create({
      data: { roleId, permissionId },
      include: { permission: true },
    })
  }

  async removePermission(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.delete({
      where: { roleId_permissionId: { roleId, permissionId } },
    })
  }
}
