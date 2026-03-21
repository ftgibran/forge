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

import { CurrentUser } from '@/auth/decorators'

import { CartsService } from './carts.service'
import { AddCartItemDto, CartResponseDto, UpdateCartItemDto } from './dto'

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @ApiOkResponse({ type: CartResponseDto })
  @ApiOperation({
    summary: 'Get the current user cart',
    operationId: 'getCart',
  })
  getCart(@CurrentUser('sub') userId: string) {
    return this.cartsService.getCart(userId)
  }

  @Post('items')
  @ApiOperation({
    summary: 'Add an item to the cart',
    operationId: 'addToCart',
  })
  addItem(@CurrentUser('sub') userId: string, @Body() dto: AddCartItemDto) {
    return this.cartsService.addItem(userId, dto)
  }

  @Patch('items/:itemId')
  @ApiOperation({
    summary: 'Update item quantity in the cart',
    operationId: 'updateCartItem',
  })
  updateItem(
    @CurrentUser('sub') userId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateItem(userId, itemId, dto)
  }

  @Delete('items/:itemId')
  @ApiOperation({
    summary: 'Remove an item from the cart',
    operationId: 'removeCartItem',
  })
  removeItem(
    @CurrentUser('sub') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartsService.removeItem(userId, itemId)
  }

  @Delete()
  @ApiOperation({ summary: 'Clear the entire cart', operationId: 'clearCart' })
  clearCart(@CurrentUser('sub') userId: string) {
    return this.cartsService.clearCart(userId)
  }
}
