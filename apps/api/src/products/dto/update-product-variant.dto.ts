import { Type } from 'class-transformer'
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class UpdateProductVariantDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  sku?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  compareAtPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number
}
