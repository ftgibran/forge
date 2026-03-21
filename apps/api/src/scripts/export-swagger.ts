import 'reflect-metadata'

import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

import { AppModule } from '@/app.module'
import { HttpExceptionFilter, TransformInterceptor } from '@/common'

async function exportSwagger() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] })

  // NOTE: Do NOT call app.setGlobalPrefix('api') here.
  // Paths must stay as /users, /products, etc. so they match
  // the axios baseURL that already ends with /api.

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())

  const config = new DocumentBuilder()
    .setTitle('Forge API')
    .setDescription('NestJS API with JWT auth, Prisma, and RBAC')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  await app.init()

  // __dirname = apps/api/src/scripts → ../../ = apps/api/
  const outputPath = resolve(__dirname, '../../swagger.json')

  writeFileSync(outputPath, JSON.stringify(document, null, 2))

  console.log(`Swagger spec written to ${outputPath}`)

  await app.close()
}

void exportSwagger()
