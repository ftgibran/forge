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
  @IsUUID()
  @IsNotEmpty()
  productId!: string

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  comment?: string
}
