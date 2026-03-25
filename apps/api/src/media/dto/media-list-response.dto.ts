import { ApiProperty } from '@nestjs/swagger'

import { MediaDto } from './media-response.dto'

export class MediaListResponseDto {
  @ApiProperty({ type: [MediaDto] })
  items!: MediaDto[]

  @ApiProperty()
  total!: number

  @ApiProperty()
  page!: number

  @ApiProperty()
  limit!: number
}
