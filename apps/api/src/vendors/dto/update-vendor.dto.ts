import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class UpdateVendorDto {
  @ApiPropertyOptional({ example: 'Dragon Prints Co.' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ example: 'dragon-prints-co' })
  @IsOptional()
  @IsString()
  slug?: string

  @ApiPropertyOptional({ example: 'Specializing in fantasy 3D prints' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  logoMediaId?: number
}
