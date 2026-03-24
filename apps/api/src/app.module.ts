import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '@/auth'
import { CartsModule } from '@/carts'
import { CategoriesModule } from '@/categories'
import { OrdersModule } from '@/orders'
import { PermissionsModule } from '@/permissions'
import { PrismaModule } from '@/prisma'
import { ProductsModule } from '@/products'
import { ReviewsModule } from '@/reviews'
import { RolesModule } from '@/roles'
import { UploadModule } from '@/upload'
import { UsersModule } from '@/users'
import { VendorsModule } from '@/vendors'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    CategoriesModule,
    VendorsModule,
    ProductsModule,
    CartsModule,
    OrdersModule,
    ReviewsModule,
    UploadModule,
  ],
})
export class AppModule {}
