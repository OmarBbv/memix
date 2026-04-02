import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { Discount } from './entities/discount.entity';
import { Product } from '../products/entities/product.entity';
import { AutoDiscountService } from './auto-discount.service';
import { ProductStock } from '../products/entities/product-stock.entity';
import { PriceHistory } from '../products/entities/price-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discount, Product, ProductStock, PriceHistory]),
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService, AutoDiscountService],
  exports: [DiscountsService, AutoDiscountService],
})
export class DiscountsModule {}
