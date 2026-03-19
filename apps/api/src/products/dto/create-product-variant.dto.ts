import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class CreateProductVariantDto {
  @ApiProperty({ example: 'Standard' })
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty({ example: 'PROD-001-STD' })
  @IsString()
  @IsNotEmpty()
  sku!: string

  @ApiProperty({ example: 29.99, minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number

  @ApiPropertyOptional({ example: 39.99, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  compareAtPrice?: number

  @ApiPropertyOptional({ example: 100, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number
}
