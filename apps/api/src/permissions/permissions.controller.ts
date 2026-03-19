import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { RequirePermissions } from '@/auth/decorators'
import { PaginationQueryDto } from '@/common'

import { CreatePermissionDto, UpdatePermissionDto } from './dto'
import { PermissionsService } from './permissions.service'

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @RequirePermissions('create:permission')
  @ApiOperation({ summary: 'Create a new permission' })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto)
  }

  @Get()
  @RequirePermissions('read:permission')
  @ApiOperation({ summary: 'List all permissions' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.permissionsService.findAll(query)
  }

  @Get(':id')
  @RequirePermissions('read:permission')
  @ApiOperation({ summary: 'Get a permission by ID' })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions('update:permission')
  @ApiOperation({ summary: 'Update a permission' })
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermissions('delete:permission')
  @ApiOperation({ summary: 'Delete a permission' })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id)
  }
}
