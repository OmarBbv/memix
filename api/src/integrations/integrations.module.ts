import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { Product } from '../products/entities/product.entity';
import { ProductStock } from '../branches/entities/product-stock.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Category } from '../categories/entities/category.entity';
import { ProductsService } from '../products/products.service';
import { PriceHistory } from '../products/entities/price-history.entity';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductStock, Branch, Category, PriceHistory]),
    SearchModule,
  ],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, ProductsService],
})
export class IntegrationsModule {}
