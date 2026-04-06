import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseLogsService } from './warehouse-logs.service';
import { WarehouseLogsController } from './warehouse-logs.controller';
import { WarehouseLog } from './entities/warehouse-log.entity';
import { Product } from '../products/entities/product.entity';
import { ProductStock } from '../products/entities/product-stock.entity';
import { Category } from '../categories/entities/category.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WarehouseLog, Product, ProductStock, Category]),
    ProductsModule,
  ],
  controllers: [WarehouseLogsController],
  providers: [WarehouseLogsService],
  exports: [WarehouseLogsService],
})
export class WarehouseLogsModule {}
