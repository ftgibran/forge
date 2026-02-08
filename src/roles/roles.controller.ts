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
import { RolesService } from './roles.service'
import { CreateRoleDto, UpdateRoleDto, AssignPermissionDto } from './dto'
import { PaginationQueryDto } from '@/common'
import { RequirePermissions } from '@/auth/decorators'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermissions('create:role')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto)
  }

  @Get()
  @RequirePermissions('read:role')
  findAll(@Query() query: PaginationQueryDto) {
    return this.rolesService.findAll(query)
  }

  @Get(':id')
  @RequirePermissions('read:role')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions('update:role')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermissions('delete:role')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id)
  }

  @Post(':id/permissions')
  @RequirePermissions('update:role')
  assignPermission(@Param('id') id: string, @Body() dto: AssignPermissionDto) {
    return this.rolesService.assignPermission(id, dto.permissionId)
  }

  @Delete(':id/permissions/:permissionId')
  @RequirePermissions('update:role')
  removePermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolesService.removePermission(id, permissionId)
  }
}
