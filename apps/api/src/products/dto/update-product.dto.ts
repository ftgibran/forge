import { ApiPropertyOptional } from '@nestjs/swagger'
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
  @ApiPropertyOptional({ example: 'Articulated Dragon' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ example: 'articulated-dragon' })
  @IsOptional()
  @IsString()
  slug?: string

  @ApiPropertyOptional({ example: 'A detailed articulated dragon model' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus

  @ApiPropertyOptional({ example: 'PLA' })
  @IsOptional()
  @IsString()
  filamentType?: string

  @ApiPropertyOptional({ example: 4.5 })
  @IsOptional()
  @IsNumber()
  printTimeHours?: number

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  dimensionX?: number

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  dimensionY?: number

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsNumber()
  dimensionZ?: number

  @ApiPropertyOptional({ example: 'STL' })
  @IsOptional()
  @IsString()
  fileFormat?: string

  @ApiPropertyOptional({ example: 0.4 })
  @IsOptional()
  @IsNumber()
  nozzleSize?: number

  @ApiPropertyOptional({ example: 20, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  infillPercentage?: number

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  supportsRequired?: boolean
}
