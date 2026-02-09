import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'
import { PaginationQueryDto } from '@/common'
import { ProductStatus } from '@/generated/prisma/client'

export class ProductQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsUUID()
  categoryId?: string

  @IsOptional()
  @IsUUID()
  vendorId?: string

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus

  @IsOptional()
  @IsString()
  filamentType?: string

  @IsOptional()
  @IsString()
  sortBy?: string
}
