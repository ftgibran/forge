import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { Public, RequirePermissions } from '@/auth/decorators'

import { CategoriesService } from './categories.service'
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from './dto'

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @RequirePermissions('create:category')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new category',
    operationId: 'createCategory',
  })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto)
  }

  @Get()
  @ApiOkResponse({ type: CategoryDto, isArray: true })
  @Public()
  @ApiOperation({
    summary: 'List all categories',
    operationId: 'getCategories',
  })
  findAll() {
    return this.categoriesService.findAll()
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoryDto })
  @Public()
  @ApiOperation({ summary: 'Get a category by ID', operationId: 'getCategory' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions('update:category')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category', operationId: 'updateCategory' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermissions('delete:category')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category', operationId: 'deleteCategory' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id)
  }
}
