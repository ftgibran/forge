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
import { ReviewsService } from './reviews.service'
import { CreateReviewDto, UpdateReviewDto } from './dto'
import { PaginationQueryDto } from '@/common'
import { CurrentUser, Public, RequirePermissions } from '@/auth/decorators'

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() dto: CreateReviewDto, @CurrentUser('sub') userId: string) {
    return this.reviewsService.create(dto, userId)
  }

  @Get('product/:productId')
  @Public()
  findByProduct(
    @Param('productId') productId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.reviewsService.findByProduct(productId, query)
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.reviewsService.update(id, dto, userId)
  }

  @Delete(':id')
  @RequirePermissions('delete:review')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id)
  }
}
