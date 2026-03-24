import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PaginatedResponseDto, VendorSnippetDto } from '@/common'
import { MediaDto } from '@/upload/dto'

export class ProductVariantDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  sku!: string

  @ApiProperty()
  price!: number

  @ApiPropertyOptional({ type: Number, nullable: true })
  compareAtPrice?: number | null

  @ApiProperty()
  stock!: number

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}

export class ProductImageDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  mediaId!: number

  @ApiPropertyOptional({ type: () => MediaDto, nullable: true })
  media?: MediaDto | null

  @ApiPropertyOptional({ type: String, nullable: true })
  altText?: string | null

  @ApiProperty()
  position!: number

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}

export class CategorySnippetDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  slug!: string
}

export class ProductCountDto {
  @ApiProperty()
  reviews!: number

  @ApiProperty()
  variants!: number
}

export class ProductListItemDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  slug!: string

  @ApiPropertyOptional({ type: String, nullable: true })
  description?: string | null

  @ApiProperty()
  vendorId!: string

  @ApiPropertyOptional({ type: String, nullable: true })
  categoryId?: string | null

  @ApiProperty()
  status!: string

  @ApiPropertyOptional({ type: String, nullable: true })
  filamentType?: string | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  printTimeHours?: number | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  dimensionX?: number | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  dimensionY?: number | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  dimensionZ?: number | null

  @ApiPropertyOptional({ type: String, nullable: true })
  fileFormat?: string | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  nozzleSize?: number | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  infillPercentage?: number | null

  @ApiPropertyOptional({ type: Boolean, nullable: true })
  supportsRequired?: boolean | null

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date

  @ApiPropertyOptional({ type: () => VendorSnippetDto })
  vendor?: VendorSnippetDto

  @ApiPropertyOptional({ type: () => CategorySnippetDto, nullable: true })
  category?: CategorySnippetDto | null

  @ApiPropertyOptional({ type: () => ProductCountDto })
  _count?: ProductCountDto

  @ApiPropertyOptional()
  averageRating?: number

  @ApiPropertyOptional({ type: () => ProductImageDto, isArray: true })
  images?: ProductImageDto[]

  @ApiPropertyOptional({ type: () => ProductVariantDto, isArray: true })
  variants?: ProductVariantDto[]
}

export class ProductDetailDto extends ProductListItemDto {
  @ApiProperty({ type: () => ProductVariantDto, isArray: true })
  declare variants: ProductVariantDto[]

  @ApiProperty({ type: () => ProductImageDto, isArray: true })
  declare images: ProductImageDto[]
}

export class ProductListResponseDto extends PaginatedResponseDto(
  ProductListItemDto,
) {}
