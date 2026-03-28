import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';

import { UploadsController } from './common/uploads.controller';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CouponsModule } from './coupons/coupons.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MailModule } from './mail/mail.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BannersModule } from './banners/banners.module';
import { SearchModule } from './search/search.module';
import { CardsModule } from './cards/cards.module';
import { DiscountsModule } from './discounts/discounts.module';
import { BrandsModule } from './brands/brands.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { PromotionsModule } from './promotions/promotions.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { AttributesModule } from './attributes/attributes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    CartsModule,
    OrdersModule,
    ReviewsModule,
    WishlistModule,
    CouponsModule,
    AnalyticsModule,
    MailModule,
    NotificationsModule,
    BannersModule,
    SearchModule,
    CardsModule,
    DiscountsModule,
    BrandsModule,
    CampaignsModule,
    PromotionsModule,
    IntegrationsModule,
    AttributesModule,
  ],
  controllers: [UploadsController],
  providers: [],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(private dataSource: DataSource) {}

  onModuleInit() {
    if (this.dataSource.isInitialized) {
      this.logger.log('🚀 PostgreSQL bağlantısı başarıyla kuruldu!');
    } else {
      this.logger.error('❌ Veritabanı bağlantısı başarısız!');
    }
  }
}
