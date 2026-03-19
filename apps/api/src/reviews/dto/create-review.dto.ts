import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator'

export class CreateReviewDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  productId!: string

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number

  @ApiPropertyOptional({ example: 'Great print quality!' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({
    example: 'The details are amazing, printed perfectly.',
  })
  @IsOptional()
  @IsString()
  comment?: string
}
