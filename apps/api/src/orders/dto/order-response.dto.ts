import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  PaginatedResponseDto,
  UserSnippetDto,
  VendorSnippetDto,
} from '@/common'

export class ShippingAddressResponseDto {
  @ApiProperty()
  street!: string

  @ApiProperty()
  city!: string

  @ApiProperty()
  state!: string

  @ApiProperty()
  zipCode!: string

  @ApiProperty()
  country!: string
}

export class OrderItemVariantDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  sku!: string

  @ApiProperty()
  price!: number

  @ApiProperty()
  stock!: number
}

export class OrderItemProductDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  slug!: string
}

export class OrderItemDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  variantId!: string

  @ApiProperty()
  productId!: string

  @ApiProperty()
  quantity!: number

  @ApiProperty()
  unitPrice!: number

  @ApiPropertyOptional({ type: () => OrderItemVariantDto })
  variant?: OrderItemVariantDto

  @ApiPropertyOptional({ type: () => OrderItemProductDto })
  product?: OrderItemProductDto
}

export class OrderListItemDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  vendorId!: string

  @ApiProperty()
  status!: string

  @ApiProperty()
  totalAmount!: number

  @ApiProperty({ type: () => ShippingAddressResponseDto })
  shippingAddress!: ShippingAddressResponseDto

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date

  @ApiPropertyOptional({ type: () => UserSnippetDto })
  user?: UserSnippetDto

  @ApiPropertyOptional({ type: () => VendorSnippetDto })
  vendor?: VendorSnippetDto
}

export class OrderDetailDto extends OrderListItemDto {
  @ApiProperty({ type: () => OrderItemDto, isArray: true })
  items!: OrderItemDto[]
}

export class OrderListResponseDto extends PaginatedResponseDto(
  OrderListItemDto,
) {}
