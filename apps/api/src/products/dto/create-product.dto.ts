import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator'
import { ProductStatus } from '@/generated/prisma/client'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  slug!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsUUID()
  vendorId!: string

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
