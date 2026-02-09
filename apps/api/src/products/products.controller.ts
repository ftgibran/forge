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

import { Public, RequirePermissions } from '@/auth/decorators'

import {
  CreateProductDto,
  CreateProductImageDto,
  CreateProductVariantDto,
  ProductQueryDto,
  UpdateProductDto,
  UpdateProductVariantDto,
} from './dto'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @RequirePermissions('create:product')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto)
  }

  @Get()
  @Public()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query)
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions('update:product')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermissions('delete:product')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id)
  }

  // Variants
  @Post(':id/variants')
  @RequirePermissions('create:product')
  addVariant(@Param('id') id: string, @Body() dto: CreateProductVariantDto) {
    return this.productsService.addVariant(id, dto)
  }

  @Patch(':id/variants/:variantId')
  @RequirePermissions('update:product')
  updateVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateProductVariantDto,
  ) {
    return this.productsService.updateVariant(id, variantId, dto)
  }

  @Delete(':id/variants/:variantId')
  @RequirePermissions('delete:product')
  removeVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productsService.removeVariant(id, variantId)
  }

  // Images
  @Post(':id/images')
  @RequirePermissions('create:product')
  addImage(@Param('id') id: string, @Body() dto: CreateProductImageDto) {
    return this.productsService.addImage(id, dto)
  }

  @Patch(':id/images/:imageId')
  @RequirePermissions('update:product')
  updateImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @Body() dto: CreateProductImageDto,
  ) {
    return this.productsService.updateImage(id, imageId, dto)
  }

  @Delete(':id/images/:imageId')
  @RequirePermissions('delete:product')
  removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.removeImage(id, imageId)
  }
}
