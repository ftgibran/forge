import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/index.js'
import { AuthModule } from './auth/auth.module.js'
import { UsersModule } from './users/users.module.js'
import { RolesModule } from './roles/roles.module.js'
import { PermissionsModule } from './permissions/permissions.module.js'

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
