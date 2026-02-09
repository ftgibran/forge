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
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  sku!: string

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number

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
