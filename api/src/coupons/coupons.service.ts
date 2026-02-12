import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon, DiscountType } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) { }

  async create(createCouponDto: CreateCouponDto) {
    const existing = await this.couponRepository.findOne({
      where: { code: createCouponDto.code.toUpperCase() },
    });

    if (existing) {
      throw new BadRequestException('Bu promo kod artıq mövcuddur');
    }

    const coupon = this.couponRepository.create({
      ...createCouponDto,
      code: createCouponDto.code.toUpperCase(),
    });

    return this.couponRepository.save(coupon);
  }

  async findAll() {
    return this.couponRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findActive() {
    return this.couponRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) {
      throw new NotFoundException('Kupon tapılmadı');
    }
    return coupon;
  }

  async validate(code: string, orderAmount: number) {
    const coupon = await this.couponRepository.findOne({
      where: { code: code.toUpperCase(), isActive: true },
    });

    if (!coupon) {
      throw new NotFoundException('Kupon tapılmadı və ya aktiv deyil');
    }

    // Bitmə tarixini yoxlayırıq
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new BadRequestException('Kuponun müddəti bitib');
    }

    // İstifadə limitini yoxlayırıq
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Kuponun istifadə limiti dolub');
    }

    // Minimum sifariş məbləğini yoxlayırıq
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      throw new BadRequestException(
        `Bu kupon üçün minimum sifariş məbləği ${coupon.minOrderAmount} AZN olmalıdır`,
      );
    }

    return coupon;
  }

  calculateDiscount(coupon: Coupon, orderAmount: number): number {
    if (coupon.type === DiscountType.PERCENTAGE) {
      return (orderAmount * coupon.value) / 100;
    } else {
      return Math.min(coupon.value, orderAmount); // Endirim sifarişdən çox ola bilməz
    }
  }

  async applyCoupon(code: string, orderAmount: number) {
    const coupon = await this.validate(code, orderAmount);
    const discount = this.calculateDiscount(coupon, orderAmount);
    const finalAmount = orderAmount - discount;

    // İstifadə sayını artırırıq
    coupon.usedCount += 1;
    await this.couponRepository.save(coupon);

    return {
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
      originalAmount: orderAmount,
      discount,
      finalAmount,
    };
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(id);
    Object.assign(coupon, updateCouponDto);
    return this.couponRepository.save(coupon);
  }

  async remove(id: number) {
    const coupon = await this.findOne(id);
    return this.couponRepository.remove(coupon);
  }
}
