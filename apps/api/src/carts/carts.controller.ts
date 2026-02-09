import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { CartsService } from './carts.service'
import { AddCartItemDto, UpdateCartItemDto } from './dto'
import { CurrentUser } from '@/auth/decorators'

@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  getCart(@CurrentUser('sub') userId: string) {
    return this.cartsService.getCart(userId)
  }

  @Post('items')
  addItem(@CurrentUser('sub') userId: string, @Body() dto: AddCartItemDto) {
    return this.cartsService.addItem(userId, dto)
  }

  @Patch('items/:itemId')
  updateItem(
    @CurrentUser('sub') userId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateItem(userId, itemId, dto)
  }

  @Delete('items/:itemId')
  removeItem(
    @CurrentUser('sub') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartsService.removeItem(userId, itemId)
  }

  @Delete()
  clearCart(@CurrentUser('sub') userId: string) {
    return this.cartsService.clearCart(userId)
  }
}
