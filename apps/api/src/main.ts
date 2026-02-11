import { ValidationPipe } from '@nestjs/common'
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { NestFactory } from '@nestjs/core'

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

  await app.listen(process.env.PORT ?? 8080)
}
void bootstrap()
