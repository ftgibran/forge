import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateVendorDto {
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
  @IsString()
  logoUrl?: string
}
