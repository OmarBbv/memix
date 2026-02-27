import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { CouponsModule } from '../coupons/coupons.module';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
  imports: [CampaignsModule, CouponsModule, DiscountsModule],
  controllers: [PromotionsController],
  providers: [PromotionsService],
})
export class PromotionsModule { }
