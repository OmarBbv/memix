import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Coupon } from '../coupons/entities/coupon.entity';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) { }

  async create(createCampaignDto: CreateCampaignDto) {
    const { couponId, ...campaignData } = createCampaignDto;

    const campaign = this.campaignRepository.create(campaignData);

    if (couponId) {
      const coupon = await this.couponRepository.findOne({ where: { id: couponId } });
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
        const coupon = await this.couponRepository.findOne({ where: { id: couponId } });
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
}
