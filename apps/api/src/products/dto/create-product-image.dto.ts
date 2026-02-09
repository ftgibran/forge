import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProductImageDto {
  @IsString()
  @IsNotEmpty()
  url!: string

  @IsOptional()
  @IsString()
  altText?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  position?: number
}
