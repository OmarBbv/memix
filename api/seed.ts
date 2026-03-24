import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { CategoriesService } from './src/categories/categories.service';
import { ProductsService } from './src/products/products.service';
import { BranchesService } from './src/branches/branches.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  // Add seed logic later
  await app.close();
}
bootstrap();
