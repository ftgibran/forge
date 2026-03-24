import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class MediaSizeDto {
  @ApiPropertyOptional({ type: String, nullable: true })
  url?: string | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  width?: number | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  height?: number | null

  @ApiPropertyOptional({ type: String, nullable: true })
  mimeType?: string | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  filesize?: number | null

  @ApiPropertyOptional({ type: String, nullable: true })
  filename?: string | null
}

export class MediaSizesDto {
  @ApiPropertyOptional({ type: () => MediaSizeDto })
  thumbnail?: MediaSizeDto

  @ApiPropertyOptional({ type: () => MediaSizeDto })
  square?: MediaSizeDto

  @ApiPropertyOptional({ type: () => MediaSizeDto })
  small?: MediaSizeDto

  @ApiPropertyOptional({ type: () => MediaSizeDto })
  medium?: MediaSizeDto

  @ApiPropertyOptional({ type: () => MediaSizeDto })
  large?: MediaSizeDto

  @ApiPropertyOptional({ type: () => MediaSizeDto })
  xlarge?: MediaSizeDto

  @ApiPropertyOptional({ type: () => MediaSizeDto })
  og?: MediaSizeDto

  @ApiPropertyOptional({ type: () => MediaSizeDto })
  google?: MediaSizeDto
}

export class MediaDto {
  @ApiProperty()
  id!: number

  @ApiPropertyOptional({ type: String, nullable: true })
  alt?: string | null

  @ApiPropertyOptional({ type: String, nullable: true })
  url?: string | null

  @ApiPropertyOptional({ type: String, nullable: true })
  filename?: string | null

  @ApiPropertyOptional({ type: String, nullable: true })
  mimeType?: string | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  filesize?: number | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  width?: number | null

  @ApiPropertyOptional({ type: Number, nullable: true })
  height?: number | null

  @ApiPropertyOptional({ type: () => MediaSizesDto, nullable: true })
  sizes?: MediaSizesDto | null

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}
