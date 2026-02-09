import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class AddCartItemDto {
  @IsUUID()
  @IsNotEmpty()
  variantId!: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number
}
