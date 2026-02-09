import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  slug!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsUUID()
  parentId?: string
}
