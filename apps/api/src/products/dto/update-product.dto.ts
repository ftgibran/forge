import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator'
import { ProductStatus } from '@/generated/prisma/client'

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  slug?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsUUID()
  categoryId?: string

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus

  @IsOptional()
  @IsString()
  filamentType?: string

  @IsOptional()
  @IsNumber()
  printTimeHours?: number

  @IsOptional()
  @IsNumber()
  dimensionX?: number

  @IsOptional()
  @IsNumber()
  dimensionY?: number

  @IsOptional()
  @IsNumber()
  dimensionZ?: number

  @IsOptional()
  @IsString()
  fileFormat?: string

  @IsOptional()
  @IsNumber()
  nozzleSize?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  infillPercentage?: number

  @IsOptional()
  @IsBoolean()
  supportsRequired?: boolean
}
