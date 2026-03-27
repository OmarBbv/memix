import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const port = process.env.PORT ?? 4444;
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://az.localhost:3000',
      'http://en.localhost:3000',
      'http://ru.localhost:3000',
      'http://localhost:5173',
      'http://localhost:4000',
    ],
    credentials: true,
  });

  await app.listen(port);
  console.log(`\n🚀 Application is running on: http://localhost:${port}\n`);
}

bootstrap();
