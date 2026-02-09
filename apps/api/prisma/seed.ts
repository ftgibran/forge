import 'dotenv/config'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create permissions for each resource
  const resources = [
    'user',
    'role',
    'permission',
    'vendor',
    'vendor-application',
    'category',
    'product',
    'order',
    'review',
  ]
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

  // Create vendor role with product/order management permissions
  const vendorRole = await prisma.role.upsert({
    where: { name: 'vendor' },
    update: {},
    create: {
      name: 'vendor',
      description: 'Vendor with product and order management access',
    },
  })

  console.log('Created roles: admin, user, vendor')

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

  // Assign vendor-relevant permissions to vendor role
  const vendorPermissions = permissions.filter(
    (p) =>
      (p.resource === 'product' &&
        ['create', 'read', 'update', 'delete'].includes(p.action)) ||
      (p.resource === 'order' && ['read', 'update'].includes(p.action)) ||
      (p.resource === 'review' && p.action === 'read'),
  )
  for (const permission of vendorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: vendorRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: vendorRole.id,
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

  // Create vendor user
  const vendorPassword = await bcrypt.hash('vendor123', 10)
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@example.com' },
    update: {},
    create: {
      email: 'vendor@example.com',
      password: vendorPassword,
      name: 'Vendor User',
    },
  })

  console.log(
    'Created users: admin@example.com, user@example.com, vendor@example.com',
  )

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

  // Assign vendor role to vendor user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: { userId: vendorUser.id, roleId: vendorRole.id },
    },
    update: {},
    create: { userId: vendorUser.id, roleId: vendorRole.id },
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

  // === Seed marketplace data ===

  // Seed categories
  const categoryData = [
    {
      name: 'Filaments',
      slug: 'filaments',
      description: '3D printing filaments and materials',
    },
    {
      name: 'Printers',
      slug: 'printers',
      description: '3D printers and printing kits',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Tools, nozzles, and printer accessories',
    },
  ]

  const categories = []
  for (const cat of categoryData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    categories.push(category)
  }

  console.log(`Created ${categories.length} categories`)

  // Seed vendor (owned by vendor user)
  const vendor = await prisma.vendor.upsert({
    where: { ownerId: vendorUser.id },
    update: {},
    create: {
      name: 'PrintMaster Pro',
      slug: 'printmaster-pro',
      description: 'Premium 3D printing supplies and equipment',
      ownerId: vendorUser.id,
      status: 'ACTIVE',
    },
  })

  console.log(`Created vendor: ${vendor.name}`)

  // Seed products with variants and images
  const product1 = await prisma.product.upsert({
    where: { slug: 'pla-filament-1kg' },
    update: {},
    create: {
      name: 'PLA Filament 1.75mm 1KG',
      slug: 'pla-filament-1kg',
      description:
        'High-quality PLA filament for everyday 3D printing. Low warping, easy to print.',
      vendorId: vendor.id,
      categoryId: categories[0].id,
      status: 'ACTIVE',
      filamentType: 'PLA',
      nozzleSize: 0.4,
      printTimeHours: 2.5,
      dimensionX: 20,
      dimensionY: 20,
      dimensionZ: 8,
      fileFormat: 'STL',
      infillPercentage: 20,
      supportsRequired: false,
    },
  })

  // Add variants for product 1
  const variantData1 = [
    { name: 'White', sku: 'PLA-WHT-1KG', price: 24.99, stock: 100 },
    { name: 'Black', sku: 'PLA-BLK-1KG', price: 24.99, stock: 85 },
    {
      name: 'Red',
      sku: 'PLA-RED-1KG',
      price: 26.99,
      compareAtPrice: 29.99,
      stock: 42,
    },
  ]

  for (const v of variantData1) {
    await prisma.productVariant.upsert({
      where: { sku: v.sku },
      update: {},
      create: { ...v, productId: product1.id },
    })
  }

  // Add image for product 1
  await prisma.productImage.upsert({
    where: { id: 'img-pla-1' },
    update: {},
    create: {
      id: 'img-pla-1',
      productId: product1.id,
      url: 'https://placehold.co/400x400?text=PLA+Filament',
      altText: 'PLA Filament spool',
      position: 0,
    },
  })

  const product2 = await prisma.product.upsert({
    where: { slug: 'petg-filament-1kg' },
    update: {},
    create: {
      name: 'PETG Filament 1.75mm 1KG',
      slug: 'petg-filament-1kg',
      description:
        'Durable PETG filament with excellent layer adhesion and chemical resistance.',
      vendorId: vendor.id,
      categoryId: categories[0].id,
      status: 'ACTIVE',
      filamentType: 'PETG',
      nozzleSize: 0.4,
      printTimeHours: 3.0,
      dimensionX: 20,
      dimensionY: 20,
      dimensionZ: 8,
      fileFormat: 'STL',
      infillPercentage: 25,
      supportsRequired: false,
    },
  })

  // Add variants for product 2
  const variantData2 = [
    { name: 'Clear', sku: 'PETG-CLR-1KG', price: 29.99, stock: 60 },
    {
      name: 'Blue',
      sku: 'PETG-BLU-1KG',
      price: 31.99,
      compareAtPrice: 34.99,
      stock: 30,
    },
  ]

  for (const v of variantData2) {
    await prisma.productVariant.upsert({
      where: { sku: v.sku },
      update: {},
      create: { ...v, productId: product2.id },
    })
  }

  // Add image for product 2
  await prisma.productImage.upsert({
    where: { id: 'img-petg-1' },
    update: {},
    create: {
      id: 'img-petg-1',
      productId: product2.id,
      url: 'https://placehold.co/400x400?text=PETG+Filament',
      altText: 'PETG Filament spool',
      position: 0,
    },
  })

  console.log('Created 2 products with variants and images')
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
