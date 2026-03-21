import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PaginatedResponseDto, PermissionSnippetDto } from '@/common'

export class RolePermissionItemDto {
  @ApiProperty({ type: () => PermissionSnippetDto })
  permission!: PermissionSnippetDto

  @ApiProperty()
  assignedAt!: Date
}

export class RoleItemDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiPropertyOptional({ type: String, nullable: true })
  description?: string | null

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date

  @ApiPropertyOptional({ type: () => RolePermissionItemDto, isArray: true })
  rolePermissions?: RolePermissionItemDto[]
}

export class RoleDetailDto extends RoleItemDto {}

export class RoleListResponseDto extends PaginatedResponseDto(RoleItemDto) {}
