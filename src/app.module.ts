import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '@/prisma'
import { AuthModule } from '@/auth'
import { UsersModule } from '@/users'
import { RolesModule } from '@/roles'
import { PermissionsModule } from '@/permissions'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
  ],
})
export class AppModule {}
