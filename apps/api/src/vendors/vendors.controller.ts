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

import {
  CreateVendorApplicationDto,
  CreateVendorDto,
  ReviewVendorApplicationDto,
  UpdateVendorDto,
} from './dto'
import { VendorsService } from './vendors.service'

@ApiTags('Vendors')
@Controller()
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post('vendors')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vendor profile' })
  create(@Body() dto: CreateVendorDto, @CurrentUser('sub') userId: string) {
    return this.vendorsService.create(dto, userId)
  }

  @Get('vendors')
  @RequirePermissions('read:vendor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all vendors' })
  findAll(
    @Query() query: PaginationQueryDto,
    @Query('status') status?: string,
  ) {
    return this.vendorsService.findAll(query, status)
  }

  @Get('vendors/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user vendor profile' })
  findMe(@CurrentUser('sub') userId: string) {
    return this.vendorsService.findMe(userId)
  }

  @Get('vendors/:id')
  @Public()
  @ApiOperation({ summary: 'Get a vendor by ID' })
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id)
  }

  @Patch('vendors/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a vendor profile' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVendorDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.vendorsService.update(id, dto, userId)
  }

  @Delete('vendors/:id')
  @RequirePermissions('delete:vendor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a vendor' })
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(id)
  }

  @Post('vendors/:id/applications')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a vendor application' })
  createApplication(
    @Param('id') id: string,
    @Body() dto: CreateVendorApplicationDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.vendorsService.createApplication(id, dto, userId)
  }

  @Get('vendor-applications')
  @RequirePermissions('read:vendor-application')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all vendor applications' })
  findAllApplications(@Query() query: PaginationQueryDto) {
    return this.vendorsService.findAllApplications(query)
  }

  @Patch('vendor-applications/:id/review')
  @RequirePermissions('update:vendor-application')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Review (approve/reject) a vendor application' })
  reviewApplication(
    @Param('id') id: string,
    @Body() dto: ReviewVendorApplicationDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.vendorsService.reviewApplication(id, dto, userId)
  }
}
