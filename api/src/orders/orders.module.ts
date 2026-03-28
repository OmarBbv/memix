import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { ProductStock } from '../products/entities/product-stock.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { MailModule } from '../mail/mail.module';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Cart, ProductStock]),
    NotificationsModule,
    MailModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, InvoicesService],
})
export class OrdersModule {}
