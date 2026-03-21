import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CategoryCountDto {
  @ApiProperty()
  products!: number
}

export class CategoryDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  slug!: string

  @ApiPropertyOptional({ type: String, nullable: true })
  description?: string | null

  @ApiPropertyOptional({ type: String, nullable: true })
  parentId?: string | null

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date

  @ApiPropertyOptional({ type: () => CategoryDto, isArray: true })
  children?: CategoryDto[]

  @ApiPropertyOptional({ type: () => CategoryCountDto })
  _count?: CategoryCountDto
}
