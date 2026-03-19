import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator'

export class ShippingAddressDto {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  street!: string

  @ApiProperty({ example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  city!: string

  @ApiProperty({ example: 'IL' })
  @IsString()
  @IsNotEmpty()
  state!: string

  @ApiProperty({ example: '62701' })
  @IsString()
  @IsNotEmpty()
  zipCode!: string

  @ApiProperty({ example: 'US' })
  @IsString()
  @IsNotEmpty()
  country!: string
}

export class CreateOrderDto {
  @ApiProperty({ type: ShippingAddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto
}
