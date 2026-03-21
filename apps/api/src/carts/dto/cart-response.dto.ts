import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CartVariantDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  sku!: string

  @ApiProperty()
  price!: number

  @ApiPropertyOptional()
  stock?: number
}

export class CartItemDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  variantId!: string

  @ApiProperty()
  quantity!: number

  @ApiPropertyOptional({ type: () => CartVariantDto })
  variant?: CartVariantDto
}

export class CartResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty({ type: () => CartItemDto, isArray: true })
  items!: CartItemDto[]
}
