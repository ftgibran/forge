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

import { Public, RequirePermissions } from '@/auth/decorators'

import {
  CreateProductDto,
  CreateProductImageDto,
  CreateProductVariantDto,
  ProductDetailDto,
  ProductListResponseDto,
  ProductQueryDto,
  UpdateProductDto,
  UpdateProductVariantDto,
} from './dto'
import { ProductsService } from './products.service'

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @RequirePermissions('create:product')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new product',
    operationId: 'createProduct',
  })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto)
  }

  @Get()
  @ApiOkResponse({ type: ProductListResponseDto })
  @Public()
  @ApiOperation({ summary: 'List all products', operationId: 'getProducts' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductDetailDto })
  @Public()
  @ApiOperation({ summary: 'Get a product by ID', operationId: 'getProduct' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions('update:product')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product', operationId: 'updateProduct' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto)
  }

  @Delete(':id')
  @RequirePermissions('delete:product')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product', operationId: 'deleteProduct' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id)
  }

  // Variants
  @Post(':id/variants')
  @RequirePermissions('create:product')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a variant to a product',
    operationId: 'addProductVariant',
  })
  addVariant(@Param('id') id: string, @Body() dto: CreateProductVariantDto) {
    return this.productsService.addVariant(id, dto)
  }

  @Patch(':id/variants/:variantId')
  @RequirePermissions('update:product')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a product variant',
    operationId: 'updateProductVariant',
  })
  updateVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateProductVariantDto,
  ) {
    return this.productsService.updateVariant(id, variantId, dto)
  }

  @Delete(':id/variants/:variantId')
  @RequirePermissions('delete:product')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove a product variant',
    operationId: 'deleteProductVariant',
  })
  removeVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productsService.removeVariant(id, variantId)
  }

  // Images
  @Post(':id/images')
  @RequirePermissions('create:product')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add an image to a product',
    operationId: 'addProductImage',
  })
  addImage(@Param('id') id: string, @Body() dto: CreateProductImageDto) {
    return this.productsService.addImage(id, dto)
  }

  @Patch(':id/images/:imageId')
  @RequirePermissions('update:product')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a product image',
    operationId: 'updateProductImage',
  })
  updateImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @Body() dto: CreateProductImageDto,
  ) {
    return this.productsService.updateImage(id, imageId, dto)
  }

  @Delete(':id/images/:imageId')
  @RequirePermissions('delete:product')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove a product image',
    operationId: 'deleteProductImage',
  })
  removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.removeImage(id, imageId)
  }
}
