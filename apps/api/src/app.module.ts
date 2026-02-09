import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '@/prisma'
import { AuthModule } from '@/auth'
import { UsersModule } from '@/users'
import { RolesModule } from '@/roles'
import { PermissionsModule } from '@/permissions'
import { CategoriesModule } from '@/categories'
import { VendorsModule } from '@/vendors'
import { ProductsModule } from '@/products'
import { CartsModule } from '@/carts'
import { OrdersModule } from '@/orders'
import { ReviewsModule } from '@/reviews'

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
  ],
})
export class AppModule {}
