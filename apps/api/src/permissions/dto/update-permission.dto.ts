import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdatePermissionDto {
  @ApiPropertyOptional({ example: 'create' })
  @IsOptional()
  @IsString()
  action?: string

  @ApiPropertyOptional({ example: 'product' })
  @IsOptional()
  @IsString()
  resource?: string

  @ApiPropertyOptional({ example: 'Allows creating products' })
  @IsOptional()
  @IsString()
  description?: string
}
