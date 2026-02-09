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

import { CurrentUser, Public, RequirePermissions } from '@/auth/decorators'
import { PaginationQueryDto } from '@/common'

import {
  CreateVendorApplicationDto,
  CreateVendorDto,
  ReviewVendorApplicationDto,
  UpdateVendorDto,
} from './dto'
import { VendorsService } from './vendors.service'

@Controller()
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post('vendors')
  create(@Body() dto: CreateVendorDto, @CurrentUser('sub') userId: string) {
    return this.vendorsService.create(dto, userId)
  }

  @Get('vendors')
  @RequirePermissions('read:vendor')
  findAll(
    @Query() query: PaginationQueryDto,
    @Query('status') status?: string,
  ) {
    return this.vendorsService.findAll(query, status)
  }

  @Get('vendors/me')
  findMe(@CurrentUser('sub') userId: string) {
    return this.vendorsService.findMe(userId)
  }

  @Get('vendors/:id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id)
  }

  @Patch('vendors/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVendorDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.vendorsService.update(id, dto, userId)
  }

  @Delete('vendors/:id')
  @RequirePermissions('delete:vendor')
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(id)
  }

  @Post('vendors/:id/applications')
  createApplication(
    @Param('id') id: string,
    @Body() dto: CreateVendorApplicationDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.vendorsService.createApplication(id, dto, userId)
  }

  @Get('vendor-applications')
  @RequirePermissions('read:vendor-application')
  findAllApplications(@Query() query: PaginationQueryDto) {
    return this.vendorsService.findAllApplications(query)
  }

  @Patch('vendor-applications/:id/review')
  @RequirePermissions('update:vendor-application')
  reviewApplication(
    @Param('id') id: string,
    @Body() dto: ReviewVendorApplicationDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.vendorsService.reviewApplication(id, dto, userId)
  }
}
