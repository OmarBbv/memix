import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { SearchModule } from '../search/search.module';
import { PriceHistory } from './entities/price-history.entity';
import { ProductStock } from './entities/product-stock.entity';
import { ProductColorVariant } from './entities/product-color-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      PriceHistory,
      ProductStock,
      ProductColorVariant,
    ]),
    SearchModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
