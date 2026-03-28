import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './src/app.module';
import { Category } from './src/categories/entities/category.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const categoryRepo = dataSource.getRepository(Category);

  const categories = await categoryRepo.find({
    select: ['id', 'name', 'slug'],
    take: 100
  });

  console.log('--- Categories in DB ---');
  categories.forEach(c => {
    console.log(`ID: ${c.id} | Name: ${c.name} | Slug: ${c.slug}`);
  });
  console.log('------------------------');

  await app.close();
}
bootstrap();
