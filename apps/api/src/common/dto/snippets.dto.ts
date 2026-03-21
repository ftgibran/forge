import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UserSnippetDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  name!: string
}

export class VendorSnippetDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  slug!: string
}

export class RoleSnippetDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiPropertyOptional({ type: String, nullable: true })
  description?: string | null
}

export class PermissionSnippetDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  action!: string

  @ApiProperty()
  resource!: string

  @ApiPropertyOptional({ type: String, nullable: true })
  description?: string | null
}
