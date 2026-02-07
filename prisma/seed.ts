import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create permissions for each resource
  const resources = ['user', 'role', 'permission']
  const actions = ['create', 'read', 'update', 'delete']

  const permissions: Array<{ id: string; action: string; resource: string }> =
    []

  for (const resource of resources) {
    for (const action of actions) {
      const permission = await prisma.permission.upsert({
        where: { action_resource: { action, resource } },
        update: {},
        create: {
          action,
          resource,
          description: `Can ${action} ${resource}`,
        },
      })
      permissions.push(permission)
    }
  }

  console.log(`Created ${permissions.length} permissions`)

  // Create admin role with all permissions
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full access',
    },
  })

  // Create user role with read-only permissions
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Regular user with limited access',
    },
  })

  console.log('Created roles: admin, user')

  // Assign all permissions to admin role
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    })
  }

  // Assign read permissions to user role
  const readPermissions = permissions.filter((p) => p.action === 'read')
  for (const permission of readPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: permission.id,
      },
    })
  }

  console.log('Assigned permissions to roles')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
    },
  })

  // Create regular user
  const userPassword = await bcrypt.hash('user1234', 10)
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
    },
  })

  console.log('Created users: admin@example.com, user@example.com')

  // Assign admin role to admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: { userId: adminUser.id, roleId: adminRole.id },
    },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  })

  // Assign user role to regular user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: { userId: regularUser.id, roleId: userRole.id },
    },
    update: {},
    create: { userId: regularUser.id, roleId: userRole.id },
  })

  console.log('Assigned roles to users')

  // Give regular user a direct permission (create:user) as an example
  const createUserPermission = permissions.find(
    (p) => p.action === 'create' && p.resource === 'user',
  )!

  await prisma.userPermission.upsert({
    where: {
      userId_permissionId: {
        userId: regularUser.id,
        permissionId: createUserPermission.id,
      },
    },
    update: {},
    create: {
      userId: regularUser.id,
      permissionId: createUserPermission.id,
    },
  })

  console.log('Assigned direct permission (create:user) to regular user')
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    void prisma.$disconnect()
  })
