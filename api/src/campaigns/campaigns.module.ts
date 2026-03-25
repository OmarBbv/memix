import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { Campaign } from './entities/campaign.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Product } from '../products/entities/product.entity';
import { Discount } from '../discounts/entities/discount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, Coupon, Product, Discount])],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
