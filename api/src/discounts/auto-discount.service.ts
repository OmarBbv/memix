import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Discount, DiscountType } from './entities/discount.entity';
import { ProductStock } from '../products/entities/product-stock.entity';
import { PriceHistory } from '../products/entities/price-history.entity';

/**
 * Sabit endirim qaydaları (müştəri tələbi):
 * - İkinci əl: 30 gün → 30%, 60 gün → 50%, 90 gün → 70% (tam avtomatik)
 * - Yeni/Outlet: 30 gün → 30% (avtomatik), 60 gün → 50%, 90 gün → 70% (admin təsdiqi lazım)
 */

interface DiscountRule {
  daysAfterListing: number;
  discountPercentage: number;
  isAutomatic: boolean;
}

const USED_RULES: DiscountRule[] = [
  { daysAfterListing: 90, discountPercentage: 70, isAutomatic: true },
  { daysAfterListing: 60, discountPercentage: 50, isAutomatic: true },
  { daysAfterListing: 30, discountPercentage: 30, isAutomatic: true },
];

const NEW_RULES: DiscountRule[] = [
  { daysAfterListing: 90, discountPercentage: 70, isAutomatic: false },
  { daysAfterListing: 60, discountPercentage: 50, isAutomatic: false },
  { daysAfterListing: 30, discountPercentage: 30, isAutomatic: true },
];

export interface PendingDiscount {
  productId: number;
  productName: string;
  brandId: number | null;
  brandName: string | null;
  listingType: string;
  daysListed: number;
  suggestedPercentage: number;
  currentPrice: number;
  suggestedPrice: number;
  createdAt: Date;
}

@Injectable()
export class AutoDiscountService {
  private readonly logger = new Logger(AutoDiscountService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Discount)
    private readonly discountsRepository: Repository<Discount>,
    @InjectRepository(ProductStock)
    private readonly productStockRepository: Repository<ProductStock>,
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepository: Repository<PriceHistory>,
  ) {}

  /**
   * Hər gün gecə saat 03:00-da işləyir.
   * İkinci əl məhsullara avtomatik endirim, yeni məhsullara isə pending qeyd yaradır.
   */
  @Cron('0 3 * * *', { name: 'auto-discount-check' })
  async handleAutoDiscounts() {
    this.logger.log('🔄 Avtomatik endirim yoxlaması başladı...');

    try {
      // İkinci əl — tam avtomatik
      await this.processUsedProducts();

      // Yeni — 30 gün avtomatik
      await this.processNewProducts();

      this.logger.log('✅ Avtomatik endirim yoxlaması tamamlandı.');
    } catch (error) {
      this.logger.error('❌ Avtomatik endirim xətası:', error);
    }
  }

  /**
   * İkinci əl məhsulları yoxlayır — tam avtomatik endirim tətbiq edir.
   */
  private async processUsedProducts() {
    const products = await this.getEligibleProducts('used');

    let applied = 0;
    for (const product of products) {
      const daysListed = this.getDaysListed(product.createdAt);
      const rule = this.findMatchingRule(USED_RULES, daysListed);

      if (!rule) continue;

      // Manual endirim varsa toxunma
      if (product.discount && !product.discount.isAutomatic) continue;

      // Eyni faizlə endirim artıq varsa, skip et
      if (
        product.discount?.isAutomatic &&
        Number(product.discount.value) === rule.discountPercentage
      ) {
        continue;
      }

      await this.applyDiscount(product, rule.discountPercentage);
      applied++;
    }

    this.logger.log(`📦 İkinci əl: ${applied} məhsula endirim tətbiq edildi.`);
  }

  /**
   * Yeni məhsulları yoxlayır — yalnız 30 günlük avtomatik, 60/90 pending.
   */
  private async processNewProducts() {
    const products = await this.getEligibleProducts('new');

    let applied = 0;
    for (const product of products) {
      const daysListed = this.getDaysListed(product.createdAt);
      const rule = this.findMatchingRule(NEW_RULES, daysListed);

      if (!rule) continue;

      // Manual endirim varsa toxunma
      if (product.discount && !product.discount.isAutomatic) continue;

      // Yalnız avtomatik qaydaları tətbiq et (30 gün)
      if (!rule.isAutomatic) continue;

      // Eyni faizlə endirim artıq varsa, skip et
      if (
        product.discount?.isAutomatic &&
        Number(product.discount.value) === rule.discountPercentage
      ) {
        continue;
      }

      await this.applyDiscount(product, rule.discountPercentage);
      applied++;
    }

    this.logger.log(`🏷️ Yeni (30 gün): ${applied} məhsula endirim tətbiq edildi.`);
  }

  /**
   * Gözləyən endirimləri qaytarır (yeni məhsullar, 60/90 gün keçmiş, admin təsdiqi gözləyən).
   * Admin panel üçün istifadə olunur.
   */
  async getPendingDiscounts(): Promise<PendingDiscount[]> {
    const products = await this.getEligibleProducts('new');
    const pending: PendingDiscount[] = [];

    for (const product of products) {
      const daysListed = this.getDaysListed(product.createdAt);
      const rule = this.findMatchingRule(NEW_RULES, daysListed);

      if (!rule || rule.isAutomatic) continue;

      // Manual endirim varsa skip
      if (product.discount && !product.discount.isAutomatic) continue;

      // Artıq bu faizlə avtomatik endirim tətbiq olunubsa skip
      if (
        product.discount?.isAutomatic &&
        Number(product.discount.value) >= rule.discountPercentage
      ) {
        continue;
      }

      const currentPrice = Number(product.price);
      const suggestedPrice = currentPrice * (1 - rule.discountPercentage / 100);

      pending.push({
        productId: product.id,
        productName: product.name,
        brandId: product.brand?.id || null,
        brandName: product.brand?.name || null,
        listingType: product.listingType,
        daysListed,
        suggestedPercentage: rule.discountPercentage,
        currentPrice,
        suggestedPrice: Math.round(suggestedPrice * 100) / 100,
        createdAt: product.createdAt,
      });
    }

    return pending;
  }

  /**
   * Admin tərəfindən toplu endirim təsdiqi (brend üzrə).
   */
  async approveBulkDiscounts(productIds: number[]): Promise<{ applied: number }> {
    let applied = 0;

    for (const productId of productIds) {
      const product = await this.productsRepository.findOne({
        where: { id: productId, isDeleted: false },
        relations: ['discount', 'brand', 'colorVariants', 'colorVariants.stocks'],
      });

      if (!product) continue;

      // Stok yoxlaması
      if (!this.hasStock(product)) continue;

      // Manual endirim varsa toxunma
      if (product.discount && !product.discount.isAutomatic) continue;

      const daysListed = this.getDaysListed(product.createdAt);
      const rule = this.findMatchingRule(NEW_RULES, daysListed);

      if (!rule) continue;

      await this.applyDiscount(product, rule.discountPercentage);
      applied++;
    }

    return { applied };
  }

  /**
   * Endirim tətbiq et — ya yenisin yarat, ya mövcudu yenilə.
   */
  private async applyDiscount(product: Product, percentage: number) {
    // Qiymət tarixçəsinə qeyd yaz
    const currentPrice = Number(product.price);

    if (product.discount) {
      // Mövcud avtomatik endirimi yenilə
      product.discount.value = percentage;
      product.discount.type = DiscountType.PERCENTAGE;
      product.discount.isAutomatic = true;
      product.discount.isActive = true;
      await this.discountsRepository.save(product.discount);
    } else {
      // Yeni endirim yarat
      const discount = this.discountsRepository.create({
        type: DiscountType.PERCENTAGE,
        value: percentage,
        isActive: true,
        isAutomatic: true,
        product: product,
      });
      await this.discountsRepository.save(discount);
    }

    this.logger.debug(
      `💰 ${product.name} — ${percentage}% endirim tətbiq edildi (Qiymət: ${currentPrice} AZN)`,
    );
  }

  /**
   * Endirimə uyğun olan məhsulları tap:
   * - Silinməmiş
   * - Stoku olan
   * - Müvafiq listingType
   */
  private async getEligibleProducts(listingType: string): Promise<Product[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const qb = this.productsRepository.createQueryBuilder('product');
    qb.leftJoinAndSelect('product.discount', 'discount');
    qb.leftJoinAndSelect('product.brand', 'brand');
    qb.leftJoinAndSelect('product.colorVariants', 'colorVariants');
    qb.leftJoinAndSelect('colorVariants.stocks', 'stocks');

    qb.where('product.isDeleted = :isDeleted', { isDeleted: false });
    qb.andWhere('product.isActive = :isActive', { isActive: true });
    qb.andWhere('product.listingType = :listingType', { listingType });
    qb.andWhere('product.createdAt <= :thirtyDaysAgo', { thirtyDaysAgo });

    const products = await qb.getMany();

    // Stoku olan məhsulları filtrələ
    return products.filter((product) => this.hasStock(product));
  }

  /**
   * Məhsulun stoku varmı yoxla.
   */
  private hasStock(product: Product): boolean {
    if (!product.colorVariants || product.colorVariants.length === 0) {
      return true; // Variant yoxdursa, stok mexanizmi istifadə olunmur
    }

    const totalStock = product.colorVariants.reduce((sum, cv) => {
      const variantStock = (cv.stocks || []).reduce(
        (s, stock) => s + (stock.stock || 0),
        0,
      );
      return sum + variantStock;
    }, 0);

    return totalStock > 0;
  }

  /**
   * Neçə gün keçib hesabla.
   */
  private getDaysListed(createdAt: Date): number {
    const now = new Date();
    const diff = now.getTime() - new Date(createdAt).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Ən uyğun qaydanı tap (ən böyük gündən başla).
   */
  private findMatchingRule(
    rules: DiscountRule[],
    daysListed: number,
  ): DiscountRule | null {
    // Qaydalar böyükdən kiçiyə sıralanıb (90, 60, 30)
    for (const rule of rules) {
      if (daysListed >= rule.daysAfterListing) {
        return rule;
      }
    }
    return null;
  }
}
