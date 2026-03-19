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

import { AssignPermissionDto, CreateRoleDto, UpdateRoleDto } from './dto'
import { RolesService } from './roles.service'

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermissions('create:role')
  @ApiOperation({ summary: 'Create a new role' })
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto)
  }

  @Get()
  @RequirePermissions('read:role')
  @ApiOperation({ summary: 'List all roles' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.rolesService.findAll(query)
  }

  @Get(':id')
  @RequirePermissions('read:role')
  @ApiOperation({ summary: 'Get a role by ID' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions('update:role')
  @ApiOperation({ summary: 'Update a role' })
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermissions('delete:role')
  @ApiOperation({ summary: 'Delete a role' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id)
  }

  @Post(':id/permissions')
  @RequirePermissions('update:role')
  @ApiOperation({ summary: 'Assign a permission to a role' })
  assignPermission(@Param('id') id: string, @Body() dto: AssignPermissionDto) {
    return this.rolesService.assignPermission(id, dto.permissionId)
  }

  @Delete(':id/permissions/:permissionId')
  @RequirePermissions('update:role')
  @ApiOperation({ summary: 'Remove a permission from a role' })
  removePermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolesService.removePermission(id, permissionId)
  }
}
