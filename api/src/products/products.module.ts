import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { SearchModule } from '../search/search.module';
import { PriceHistory } from './entities/price-history.entity';
import { ProductStock } from '../branches/entities/product-stock.entity';
import { Branch } from '../branches/entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, PriceHistory, ProductStock, Branch]), SearchModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
