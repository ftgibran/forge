import { IsOptional, IsString } from 'class-validator'

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  action?: string

  @IsOptional()
  @IsString()
  resource?: string

  @IsOptional()
  @IsString()
  description?: string
}
