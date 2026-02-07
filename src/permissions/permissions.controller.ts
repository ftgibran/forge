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
import { PermissionsService } from './permissions.service.js'
import { CreatePermissionDto } from './dto/create-permission.dto.js'
import { UpdatePermissionDto } from './dto/update-permission.dto.js'
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js'
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator.js'

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @RequirePermissions('create:permission')
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto)
  }

  @Get()
  @RequirePermissions('read:permission')
  findAll(@Query() query: PaginationQueryDto) {
    return this.permissionsService.findAll(query)
  }

  @Get(':id')
  @RequirePermissions('read:permission')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions('update:permission')
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermissions('delete:permission')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id)
  }
}
