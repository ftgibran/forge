import { Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export function PaginatedResponseDto<T>(ItemClass: Type<T>) {
  class PaginatedClass {
    @ApiProperty({ type: ItemClass, isArray: true })
    items!: T[]

    @ApiProperty()
    total!: number

    @ApiProperty()
    page!: number

    @ApiProperty()
    limit!: number

    @ApiProperty()
    totalPages!: number
  }

  return PaginatedClass
}
