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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CurrentUser, Public, RequirePermissions } from '@/auth/decorators'
import { PaginationQueryDto } from '@/common'

import { CreateReviewDto, UpdateReviewDto } from './dto'
import { ReviewsService } from './reviews.service'

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product review' })
  create(@Body() dto: CreateReviewDto, @CurrentUser('sub') userId: string) {
    return this.reviewsService.create(dto, userId)
  }

  @Get('product/:productId')
  @Public()
  @ApiOperation({ summary: 'List reviews for a product' })
  findByProduct(
    @Param('productId') productId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.reviewsService.findByProduct(productId, query)
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a review by ID' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.reviewsService.update(id, dto, userId)
  }

  @Delete(':id')
  @RequirePermissions('delete:review')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review' })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id)
  }
}
