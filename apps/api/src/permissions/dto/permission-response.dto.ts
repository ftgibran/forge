import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PaginatedResponseDto } from '@/common'

export class PermissionDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  action!: string

  @ApiProperty()
  resource!: string

  @ApiPropertyOptional({ type: String, nullable: true })
  description?: string | null

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}

export class PermissionListResponseDto extends PaginatedResponseDto(
  PermissionDto,
) {}
