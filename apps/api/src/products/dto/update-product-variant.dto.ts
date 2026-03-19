import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class UpdateProductVariantDto {
  @ApiPropertyOptional({ example: 'Standard' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ example: 'PROD-001-STD' })
  @IsOptional()
  @IsString()
  sku?: string

  @ApiPropertyOptional({ example: 29.99, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number

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
