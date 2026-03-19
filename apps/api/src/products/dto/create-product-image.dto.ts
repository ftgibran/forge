import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

export class CreateProductImageDto {
  @ApiProperty({ example: 'https://example.com/images/dragon.jpg' })
  @IsString()
  @IsNotEmpty()
  url!: string

  @ApiPropertyOptional({ example: 'Articulated dragon side view' })
  @IsOptional()
  @IsString()
  altText?: string

  @ApiPropertyOptional({ example: 0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  position?: number
}
