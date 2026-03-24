import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateVendorDto {
  @ApiProperty({ example: 'Dragon Prints Co.' })
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty({ example: 'dragon-prints-co' })
  @IsString()
  @IsNotEmpty()
  slug!: string

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
