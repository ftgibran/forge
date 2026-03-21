import { ApiProperty } from '@nestjs/swagger'

import {
  PaginatedResponseDto,
  PermissionSnippetDto,
  RoleSnippetDto,
} from '@/common'

export class UserRoleItemDto {
  @ApiProperty({ type: () => RoleSnippetDto })
  role!: RoleSnippetDto

  @ApiProperty()
  assignedAt!: Date
}

export class UserPermissionItemDto {
  @ApiProperty({ type: () => PermissionSnippetDto })
  permission!: PermissionSnippetDto

  @ApiProperty()
  assignedAt!: Date
}

export class UserItemDto {
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
}

export class UserDetailDto extends UserItemDto {
  @ApiProperty({ type: () => UserRoleItemDto, isArray: true })
  userRoles!: UserRoleItemDto[]

  @ApiProperty({ type: () => UserPermissionItemDto, isArray: true })
  userPermissions!: UserPermissionItemDto[]
}

export class UserListResponseDto extends PaginatedResponseDto(UserItemDto) {}
