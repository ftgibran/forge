import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { VendorSnippetDto } from '@/common'
import { UserPermissionItemDto, UserRoleItemDto } from '@/users/dto'

export class ProfileResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date

  @ApiPropertyOptional({ type: () => VendorSnippetDto })
  vendor?: VendorSnippetDto

  @ApiPropertyOptional({ type: () => UserRoleItemDto, isArray: true })
  userRoles?: UserRoleItemDto[]

  @ApiPropertyOptional({ type: () => UserPermissionItemDto, isArray: true })
  userPermissions?: UserPermissionItemDto[]
}
