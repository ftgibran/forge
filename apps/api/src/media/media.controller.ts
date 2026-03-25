import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

import {
  GetMediaParamsDto,
  MediaDto,
  MediaListResponseDto,
  UpdateMediaDto,
  UploadFileDto,
} from './dto'
import { MediaService } from './media.service'

@ApiTags('Media')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiOperation({
    summary: 'List all media',
    operationId: 'getMediaList',
  })
  @ApiOkResponse({ type: MediaListResponseDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: GetMediaParamsDto): Promise<MediaListResponseDto> {
    return this.mediaService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get media by ID',
    operationId: 'getMedia',
  })
  @ApiOkResponse({ type: MediaDto })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<MediaDto> {
    return this.mediaService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update media alt text',
    operationId: 'updateMedia',
  })
  @ApiOkResponse({ type: MediaDto })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMediaDto,
  ): Promise<MediaDto> {
    return this.mediaService.update(id, dto)
  }

  @Post()
  @ApiOperation({
    summary: 'Upload an image and generate all configured sizes',
    operationId: 'uploadMedia',
  })
  @ApiCreatedResponse({ type: MediaDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|webp|gif)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('alt') alt?: string,
  ): Promise<MediaDto> {
    return this.mediaService.processAndUpload(file, alt)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a media record and its S3 objects',
    operationId: 'deleteMedia',
  })
  @ApiParam({ name: 'id', type: Number })
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.mediaService.deleteMedia(id)
  }
}
