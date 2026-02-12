import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const port = process.env.PORT ?? 4444;
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  await app.listen(port);
  console.log(`\n🚀 Application is running on: http://localhost:${port}\n`);
}

bootstrap();
