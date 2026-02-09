import { IsNotEmpty, IsString } from 'class-validator'

export class CreateVendorApplicationDto {
  @IsString()
  @IsNotEmpty()
  message!: string
}
