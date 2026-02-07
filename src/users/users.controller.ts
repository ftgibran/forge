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
import { UsersService } from './users.service.js'
import { CreateUserDto } from './dto/create-user.dto.js'
import { UpdateUserDto } from './dto/update-user.dto.js'
import { AssignRoleDto } from './dto/assign-role.dto.js'
import { AssignPermissionDto } from './dto/assign-permission.dto.js'
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js'
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator.js'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('create:user')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }

  @Get()
  @RequirePermissions('read:user')
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query)
  }

  @Get(':id')
  @RequirePermissions('read:user')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions('update:user')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermissions('delete:user')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

  @Post(':id/roles')
  @RequirePermissions('update:user')
  assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto) {
    return this.usersService.assignRole(id, dto.roleId)
  }

  @Delete(':id/roles/:roleId')
  @RequirePermissions('update:user')
  removeRole(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.usersService.removeRole(id, roleId)
  }

  @Post(':id/permissions')
  @RequirePermissions('update:user')
  assignPermission(@Param('id') id: string, @Body() dto: AssignPermissionDto) {
    return this.usersService.assignPermission(id, dto.permissionId)
  }

  @Delete(':id/permissions/:permissionId')
  @RequirePermissions('update:user')
  removePermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.usersService.removePermission(id, permissionId)
  }
}
