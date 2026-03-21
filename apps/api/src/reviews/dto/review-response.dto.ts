import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PaginatedResponseDto, UserSnippetDto } from '@/common'

export class ReviewProductSnippetDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  slug!: string
}

export class ReviewDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  productId!: string

  @ApiProperty()
  rating!: number

  @ApiPropertyOptional({ type: String, nullable: true })
  title?: string | null

  @ApiPropertyOptional({ type: String, nullable: true })
  comment?: string | null

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date

  @ApiPropertyOptional({ type: () => UserSnippetDto })
  user?: UserSnippetDto

  @ApiPropertyOptional({ type: () => ReviewProductSnippetDto })
  product?: ReviewProductSnippetDto
}

export class ReviewListResponseDto extends PaginatedResponseDto(ReviewDto) {}
