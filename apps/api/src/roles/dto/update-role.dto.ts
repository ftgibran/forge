import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'admin' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ example: 'Full access role' })
  @IsOptional()
  @IsString()
  description?: string
}
