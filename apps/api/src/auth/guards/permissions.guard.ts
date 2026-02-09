import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { PERMISSIONS_KEY } from '@/auth/decorators'
import { PrismaService } from '@/prisma'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { id: string } }>()
    const userId = request.user?.id

    if (!userId) {
      return false
    }

    // Gather permissions from direct user permissions and role permissions
    const [directPermissions, rolePermissions] = await Promise.all([
      this.prisma.userPermission.findMany({
        where: { userId },
        include: { permission: true },
      }),
      this.prisma.userRole.findMany({
        where: { userId },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
        },
      }),
    ])

    const userPermissions = new Set<string>()

    for (const dp of directPermissions) {
      userPermissions.add(`${dp.permission.action}:${dp.permission.resource}`)
    }

    for (const ur of rolePermissions) {
      for (const rp of ur.role.rolePermissions) {
        userPermissions.add(`${rp.permission.action}:${rp.permission.resource}`)
      }
    }

    return requiredPermissions.every((perm) => userPermissions.has(perm))
  }
}
