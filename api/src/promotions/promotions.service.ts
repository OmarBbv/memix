import { Injectable } from '@nestjs/common';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CouponsService } from '../coupons/coupons.service';
import { DiscountsService } from '../discounts/discounts.service';

@Injectable()
export class PromotionsService {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly couponsService: CouponsService,
    private readonly discountsService: DiscountsService,
  ) { }

  async getPromotionsPage() {
    const [campaigns, coupons, discounts] = await Promise.all([
      this.campaignsService.findActive(),
      this.couponsService.findActive(),
      this.discountsService.findAll(),
    ]);

    // Yalnız aktiv endirimli məhsulları filtr edirik
    const now = new Date();
    const discountedProducts = discounts
      .filter((d) => {
        if (!d.isActive) return false;
        if (d.startDate && new Date(d.startDate) > now) return false;
        if (d.endDate && new Date(d.endDate) < now) return false;
        return true;
      })
      .map((d) => ({
        discount: {
          id: d.id,
          type: d.type,
          value: d.value,
        },
        product: d.product,
      }));

    return {
      campaigns,
      coupons,
      discountedProducts,
    };
  }
}
