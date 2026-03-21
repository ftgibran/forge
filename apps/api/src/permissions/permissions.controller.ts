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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { RequirePermissions } from '@/auth/decorators'
import { PaginationQueryDto } from '@/common'

import {
  CreatePermissionDto,
  PermissionDto,
  PermissionListResponseDto,
  UpdatePermissionDto,
} from './dto'
import { PermissionsService } from './permissions.service'

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @RequirePermissions('create:permission')
  @ApiOperation({
    summary: 'Create a new permission',
    operationId: 'createPermission',
  })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto)
  }

  @Get()
  @ApiOkResponse({ type: PermissionListResponseDto })
  @RequirePermissions('read:permission')
  @ApiOperation({
    summary: 'List all permissions',
    operationId: 'getPermissions',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.permissionsService.findAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: PermissionDto })
  @RequirePermissions('read:permission')
  @ApiOperation({
    summary: 'Get a permission by ID',
    operationId: 'getPermission',
  })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions('update:permission')
  @ApiOperation({
    summary: 'Update a permission',
    operationId: 'updatePermission',
  })
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermissions('delete:permission')
  @ApiOperation({
    summary: 'Delete a permission',
    operationId: 'deletePermission',
  })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id)
  }
}
