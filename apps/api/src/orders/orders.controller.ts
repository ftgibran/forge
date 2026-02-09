import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto, UpdateOrderStatusDto } from './dto'
import { PaginationQueryDto } from '@/common'
import { CurrentUser, RequirePermissions } from '@/auth/decorators'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@CurrentUser('sub') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.checkout(userId, dto)
  }

  @Get()
  @RequirePermissions('read:order')
  findAll(@Query() query: PaginationQueryDto) {
    return this.ordersService.findAll(query)
  }

  @Get('my')
  findMyOrders(
    @CurrentUser('sub') userId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.ordersService.findMyOrders(userId, query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id)
  }

  @Patch(':id/status')
  @RequirePermissions('update:order')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto)
  }
}
