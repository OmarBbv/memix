import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Product } from '../products/entities/product.entity';
import { Discount, DiscountType } from '../discounts/entities/discount.entity';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto) {
    const { couponId, ...campaignData } = createCampaignDto;

    const campaign = this.campaignRepository.create(campaignData);

    if (couponId) {
      const coupon = await this.couponRepository.findOne({
        where: { id: couponId },
      });
      if (!coupon) {
        throw new NotFoundException(`Kupon tapılmadı (ID: ${couponId})`);
      }
      campaign.coupon = coupon;
    }

    return this.campaignRepository.save(campaign);
  }

  async findAll() {
    return this.campaignRepository.find({
      relations: ['coupon'],
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findActive() {
    const now = new Date();

    const campaigns = await this.campaignRepository.find({
      where: { isActive: true },
      relations: ['coupon'],
      order: { order: 'ASC', createdAt: 'DESC' },
    });

    return campaigns.filter((c) => {
      if (c.startDate && new Date(c.startDate) > now) return false;
      if (c.endDate && new Date(c.endDate) < now) return false;
      return true;
    });
  }

  async findOne(id: number) {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['coupon'],
    });

    if (!campaign) {
      throw new NotFoundException(`Kampaniya tapılmadı (ID: ${id})`);
    }

    return campaign;
  }

  async update(id: number, updateCampaignDto: UpdateCampaignDto) {
    const campaign = await this.findOne(id);
    const { couponId, ...updateData } = updateCampaignDto;

    Object.assign(campaign, updateData);

    if (couponId !== undefined) {
      if (couponId === null) {
        campaign.coupon = null as any;
      } else {
        const coupon = await this.couponRepository.findOne({
          where: { id: couponId },
        });
        if (!coupon) {
          throw new NotFoundException(`Kupon tapılmadı (ID: ${couponId})`);
        }
        campaign.coupon = coupon;
      }
    }

    return this.campaignRepository.save(campaign);
  }

  async remove(id: number) {
    const campaign = await this.findOne(id);
    return this.campaignRepository.remove(campaign);
  }

  async applyBulkDiscount(
    campaignId: number,
    targetType: 'category' | 'brand',
    targetId: number,
    discountType: 'percentage' | 'fixed',
    discountValue: number,
  ) {
    const campaign = await this.findOne(campaignId);

    let products: Product[] = [];
    if (targetType === 'category') {
      products = await this.productRepository.find({
        where: { category: { id: targetId } },
      });
    } else {
      // NOTE: Project relies on 'tags' or 'variants' if brand is not a specific relation. 
      // If brand doesn't exist natively, it might be in tags or variants. 
      // But assuming there is no brand relation right now since it wasn't seen in product entity.
      // We will just support category for now, or you can expand to 'brand' if it gets added in the future.
      throw new NotFoundException(`Bu hədəf növü (targetType: ${targetType}) dəstəklənmir`);
    }

    if (products.length === 0) {
      return { message: 'Bu hədəf üçün məhsul tapılmadı', count: 0 };
    }

    // Əvvəlcə bu kampaniyaya və həmin məhsullara aid köhnə endirimləri təmizləyək.
    // Lakin OneToOne olduğu üçün, bu məhsulların hər hansı asılı endirimi varsa onları siləcəyik
    const productIds = products.map((p) => p.id);
    const existingDiscounts = await this.discountRepository
      .createQueryBuilder('discount')
      .leftJoinAndSelect('discount.product', 'product')
      .where('product.id IN (:...productIds)', { productIds })
      .getMany();

    if (existingDiscounts.length > 0) {
      await this.discountRepository.remove(existingDiscounts);
    }

    // Yeni endirimləri yaradırıq
    const discountsToInsert = products.map((product) => {
      const discount = new Discount();
      discount.campaign = campaign;
      discount.product = product;
      discount.type = discountType as DiscountType;
      discount.value = discountValue;
      discount.isActive = true;
      // Start/End date can be inherited from campaign if needed,
      // but campaign itself will dictate overall active status based on its dates
      discount.startDate = campaign.startDate;
      discount.endDate = campaign.endDate;
      return discount;
    });

    await this.discountRepository.save(discountsToInsert);

    return {
      message: 'Toplu endirim əlavə edildi',
      count: discountsToInsert.length,
    };
  }

  async removeBulkDiscount(campaignId: number) {
    const discounts = await this.discountRepository.find({
      where: { campaign: { id: campaignId } },
    });

    if (discounts.length > 0) {
      await this.discountRepository.remove(discounts);
    }

    return {
      message: 'Kampaniyaya aid bütün endirimlər ləğv edildi',
      count: discounts.length,
    };
  }
}
