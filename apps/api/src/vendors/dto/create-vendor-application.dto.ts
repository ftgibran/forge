import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateVendorApplicationDto {
  @ApiProperty({
    example: 'I would like to sell my 3D prints on this platform.',
  })
  @IsString()
  @IsNotEmpty()
  message!: string
}
