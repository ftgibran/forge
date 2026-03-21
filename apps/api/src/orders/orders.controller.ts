import {
  Body,
  Controller,
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

import { CurrentUser, RequirePermissions } from '@/auth/decorators'
import { PaginationQueryDto } from '@/common'

import {
  CreateOrderDto,
  OrderDetailDto,
  OrderListResponseDto,
  UpdateOrderStatusDto,
} from './dto'
import { OrdersService } from './orders.service'

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @ApiOperation({
    summary: 'Checkout and create an order from the cart',
    operationId: 'checkout',
  })
  checkout(@CurrentUser('sub') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.checkout(userId, dto)
  }

  @Get()
  @ApiOkResponse({ type: OrderListResponseDto })
  @RequirePermissions('read:order')
  @ApiOperation({ summary: 'List all orders', operationId: 'getOrders' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.ordersService.findAll(query)
  }

  @Get('my')
  @ApiOkResponse({ type: OrderListResponseDto })
  @ApiOperation({
    summary: 'List the current user orders',
    operationId: 'getMyOrders',
  })
  findMyOrders(
    @CurrentUser('sub') userId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.ordersService.findMyOrders(userId, query)
  }

  @Get(':id')
  @ApiOkResponse({ type: OrderDetailDto })
  @ApiOperation({ summary: 'Get an order by ID', operationId: 'getOrder' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id)
  }

  @Patch(':id/status')
  @RequirePermissions('update:order')
  @ApiOperation({
    summary: 'Update order status',
    operationId: 'updateOrderStatus',
  })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto)
  }
}
