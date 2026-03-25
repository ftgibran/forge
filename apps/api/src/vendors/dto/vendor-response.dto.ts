import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  PaginatedResponseDto,
  UserSnippetDto,
  VendorSnippetDto,
} from '@/common'
import { MediaDto } from '@/media/dto'

export class VendorCountDto {
  @ApiProperty()
  products!: number
}

export class VendorDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  slug!: string

  @ApiPropertyOptional({ type: String, nullable: true })
  description?: string | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  logoMediaId?: number | null

  @ApiPropertyOptional({ type: () => MediaDto, nullable: true })
  logoMedia?: MediaDto | null

  @ApiProperty()
  ownerId!: string

  @ApiProperty()
  status!: string

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date

  @ApiPropertyOptional({ type: () => UserSnippetDto })
  owner?: UserSnippetDto

  @ApiPropertyOptional({ type: () => VendorCountDto })
  _count?: VendorCountDto
}

export class VendorListResponseDto extends PaginatedResponseDto(VendorDto) {}

export class VendorApplicationDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  vendorId!: string

  @ApiProperty()
  message!: string

  @ApiProperty()
  status!: string

  @ApiPropertyOptional({ type: String, nullable: true })
  reviewedById?: string | null

  @ApiPropertyOptional({ type: Date, nullable: true })
  reviewedAt?: Date | null

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date

  @ApiPropertyOptional({ type: () => VendorSnippetDto })
  vendor?: VendorSnippetDto

  @ApiPropertyOptional({ type: () => UserSnippetDto, nullable: true })
  reviewedBy?: UserSnippetDto | null
}

export class VendorApplicationListResponseDto extends PaginatedResponseDto(
  VendorApplicationDto,
) {}
