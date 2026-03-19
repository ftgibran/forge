import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiPropertyOptional({ example: 'Full access role' })
  @IsOptional()
  @IsString()
  description?: string
}
