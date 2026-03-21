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
  AssignPermissionDto,
  AssignRoleDto,
  CreateUserDto,
  UpdateUserDto,
  UserDetailDto,
  UserListResponseDto,
} from './dto'
import { UsersService } from './users.service'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('create:user')
  @ApiOperation({ summary: 'Create a new user', operationId: 'createUser' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }

  @Get()
  @ApiOkResponse({ type: UserListResponseDto })
  @RequirePermissions('read:user')
  @ApiOperation({ summary: 'List all users', operationId: 'getUsers' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: UserDetailDto })
  @RequirePermissions('read:user')
  @ApiOperation({ summary: 'Get a user by ID', operationId: 'getUser' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions('update:user')
  @ApiOperation({ summary: 'Update a user', operationId: 'updateUser' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermissions('delete:user')
  @ApiOperation({ summary: 'Delete a user', operationId: 'deleteUser' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

  @Post(':id/roles')
  @RequirePermissions('update:user')
  @ApiOperation({
    summary: 'Assign a role to a user',
    operationId: 'assignUserRole',
  })
  assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto) {
    return this.usersService.assignRole(id, dto.roleId)
  }

  @Delete(':id/roles/:roleId')
  @RequirePermissions('update:user')
  @ApiOperation({
    summary: 'Remove a role from a user',
    operationId: 'removeUserRole',
  })
  removeRole(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.usersService.removeRole(id, roleId)
  }

  @Post(':id/permissions')
  @RequirePermissions('update:user')
  @ApiOperation({
    summary: 'Assign a permission directly to a user',
    operationId: 'assignUserPermission',
  })
  assignPermission(@Param('id') id: string, @Body() dto: AssignPermissionDto) {
    return this.usersService.assignPermission(id, dto.permissionId)
  }

  @Delete(':id/permissions/:permissionId')
  @RequirePermissions('update:user')
  @ApiOperation({
    summary: 'Remove a direct permission from a user',
    operationId: 'removeUserPermission',
  })
  removePermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.usersService.removePermission(id, permissionId)
  }
}
