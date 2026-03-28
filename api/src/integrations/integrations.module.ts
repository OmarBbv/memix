import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductStock } from '../products/entities/product-stock.entity';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Discount } from '../discounts/entities/discount.entity';
import { ProductColorVariant } from '../products/entities/product-color-variant.entity';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsService } from '../products/products.service';
import { PriceHistory } from '../products/entities/price-history.entity';
import { SearchModule } from '../search/search.module';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductStock,
      Category,
      PriceHistory,
      Discount,
      Brand,
      ProductColorVariant,
    ]),
    CategoriesModule,
    SearchModule,
  ],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, ProductsService],
})
export class IntegrationsModule {}
