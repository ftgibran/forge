import { Logger, ValidationPipe } from '@nestjs/common'
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from '@/app.module'
import { HttpExceptionFilter, TransformInterceptor } from '@/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const allowedOrigins = (
    process.env.CORS_ORIGIN || 'http://localhost:3000'
  ).split(',')

  app.enableCors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, requestOrigin)
      } else {
        callback(new Error(`Origin ${requestOrigin} not allowed by CORS`))
      }
    },
    credentials: true,
  } satisfies CorsOptions)

  app.setGlobalPrefix('api')

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

  SwaggerModule.setup('', app, document)

  await app.listen(process.env.PORT ?? 8080)

  const dbUrl = new URL(process.env.DATABASE_URL ?? '')

  const dbLine = `  Database host: ${dbUrl.host}  `
  const width = dbLine.length
  const border = '═'.repeat(width)

  Logger.log(`\n╔${border}╗\n║${dbLine}║\n╚${border}╝`, 'Bootstrap')
}
void bootstrap()
