import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

import { PrismaService } from '@/prisma'

import { MediaDto } from './dto'
import { ImageSizeConfig, uploadConfig } from './upload.config'

@Injectable()
export class UploadService {
  private readonly s3: S3Client
  private readonly bucket: string
  private readonly publicUrl: string

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: this.config.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    })
    this.bucket = this.config.get<string>('AWS_S3_BUCKET')!
    this.publicUrl = this.config.get<string>('AWS_S3_PUBLIC_URL')!
  }

  async processAndUpload(
    file: Express.Multer.File,
    alt?: string,
  ): Promise<MediaDto> {
    const uuid = uuidv4()
    const prefix = `uploads/${uuid}`
    const { format, options } = uploadConfig.formatOptions

    // Get original metadata
    const metadata = await sharp(file.buffer).metadata()
    const originalWidth = metadata.width ?? null
    const originalHeight = metadata.height ?? null

    // Upload original (converted to webp)
    const originalBuffer = await sharp(file.buffer)
      .rotate()
      .toFormat(format, options)
      .toBuffer()
    const originalFilename = `original.${format}`
    const originalKey = `${prefix}/${originalFilename}`
    const originalUrl = await this.uploadToS3(
      originalBuffer,
      originalKey,
      `image/${format}`,
    )
    const originalFilesize = originalBuffer.length

    // Process and upload each size
    const sizesRecord: Record<string, object> = {}

    await Promise.all(
      uploadConfig.imageSizes.map(async (sizeConfig: ImageSizeConfig) => {
        const sizeBuffer = await this.processSize(file.buffer, sizeConfig)
        const sizeName = sizeConfig.name
        const sizeFilename = `${sizeName}.${sizeConfig.formatOptions.format}`
        const sizeKey = `${prefix}/${sizeFilename}`
        const sizeUrl = await this.uploadToS3(
          sizeBuffer.data,
          sizeKey,
          `image/${sizeConfig.formatOptions.format}`,
        )

        sizesRecord[sizeName] = {
          url: sizeUrl,
          width: sizeBuffer.info.width,
          height: sizeBuffer.info.height,
          mimeType: `image/${sizeConfig.formatOptions.format}`,
          filesize: sizeBuffer.data.length,
          filename: sizeFilename,
        }
      }),
    )

    const originalBasename = file.originalname.replace(/\.[^/.]+$/, '')
    const filename = `${originalBasename}.${format}`

    const media = await this.prisma.media.create({
      data: {
        alt: alt ?? null,
        url: originalUrl,
        filename,
        mimeType: `image/${format}`,
        filesize: originalFilesize,
        width: originalWidth,
        height: originalHeight,
        sizes: sizesRecord,
      },
    })

    return media as MediaDto
  }

  private async processSize(
    buffer: Buffer,
    sizeConfig: ImageSizeConfig,
  ): Promise<{ data: Buffer; info: sharp.OutputInfo }> {
    const { format, options } = sizeConfig.formatOptions
    let pipeline = sharp(buffer).rotate()

    if (sizeConfig.height !== undefined && sizeConfig.crop) {
      pipeline = pipeline.resize(sizeConfig.width, sizeConfig.height, {
        fit: 'cover',
        position: sizeConfig.crop,
      })
    } else {
      pipeline = pipeline.resize(sizeConfig.width, undefined, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    return pipeline
      .toFormat(format, options ?? {})
      .toBuffer({ resolveWithObject: true })
  }

  private async uploadToS3(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    )

    return `${this.publicUrl}/${key}`
  }
}
