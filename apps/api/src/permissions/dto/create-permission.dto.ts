import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreatePermissionDto {
  @ApiProperty({ example: 'create' })
  @IsString()
  @IsNotEmpty()
  action!: string

  @ApiProperty({ example: 'product' })
  @IsString()
  @IsNotEmpty()
  resource!: string

  @ApiPropertyOptional({ example: 'Allows creating products' })
  @IsOptional()
  @IsString()
  description?: string
}
