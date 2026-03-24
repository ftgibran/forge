import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file!: Express.Multer.File

  @ApiPropertyOptional({ type: String })
  alt?: string
}
