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

import { CurrentUser, Public, RequirePermissions } from '@/auth/decorators'
import { PaginationQueryDto } from '@/common'

import {
  CreateReviewDto,
  ReviewDto,
  ReviewListResponseDto,
  UpdateReviewDto,
} from './dto'
import { ReviewsService } from './reviews.service'

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a product review',
    operationId: 'createReview',
  })
  create(@Body() dto: CreateReviewDto, @CurrentUser('sub') userId: string) {
    return this.reviewsService.create(dto, userId)
  }

  @Get('product/:productId')
  @ApiOkResponse({ type: ReviewListResponseDto })
  @Public()
  @ApiOperation({
    summary: 'List reviews for a product',
    operationId: 'getProductReviews',
  })
  findByProduct(
    @Param('productId') productId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.reviewsService.findByProduct(productId, query)
  }

  @Get(':id')
  @ApiOkResponse({ type: ReviewDto })
  @Public()
  @ApiOperation({ summary: 'Get a review by ID', operationId: 'getReview' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review', operationId: 'updateReview' })
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
  @ApiOperation({ summary: 'Delete a review', operationId: 'deleteReview' })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id)
  }
}
