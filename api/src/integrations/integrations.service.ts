import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductStock } from '../products/entities/product-stock.entity';
import {
  Discount,
  DiscountType,
} from '../discounts/entities/discount.entity';
import { PriceHistory } from '../products/entities/price-history.entity';
import { SearchService } from '../search/search.service';
import { Category, SizeType } from '../categories/entities/category.entity';
import { CategoriesService } from '../categories/categories.service';
import { Brand } from '../brands/entities/brand.entity';
import { ProductColorVariant } from '../products/entities/product-color-variant.entity';

// 1C inteqrasiyası üçün giriş tipləri
export interface StockInfo {
  stock: number;
  size?: string;
  color?: string;
}

export interface ProductSyncItem {
  sku: string;
  guid1c?: string; // 1C-den gelen GUID
  name?: string;
  price?: number | string;
  gender?: string;
  weight?: number | string;
  barcode?: string;
  category?: string; // Kateqoriya adı və ya GUID
  brand?: string; // Brend adı və ya GUID
  variants?: Record<string, unknown>;
  stocks?: StockInfo[];
  isActive?: boolean;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    startDate?: string;
    endDate?: string;
  };
}



export interface CategorySyncItem {
  guid1c?: string; // 1C tərəfindəki ID (mütləq olması tövsiyə edilir)
  name: string;
  parentGuid1c?: string; // Üst kateqoriya GUID-i
  parentName?: string; // Üst kateqoriya adı (Alternativ)
  parentId?: number; // Üst kateqoriya sistem ID-si
  isActive?: boolean;
  sizeType?: string; // Ölçü tipi (məs: ayaqqabi, beden-text və s.)
}

export interface SyncResult {
  sku: string;
  status: 'success' | 'error';
  productId?: number;
  guid1c?: string;
  message?: string;
}

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductStock)
    private productStockRepository: Repository<ProductStock>,
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(ProductColorVariant)
    private productColorVariantRepository: Repository<ProductColorVariant>,
    private readonly categoriesService: CategoriesService,
    private readonly searchService: SearchService,
  ) { }

  /**
   * 1C-den gelen mehsullari ve stoklari sinxronize et
   */
  async syncProducts(data: ProductSyncItem | ProductSyncItem[]) {
    const products = Array.isArray(data) ? data : [data];
    const results: SyncResult[] = [];

    for (const item of products) {
      try {
        const product = await this.syncSingleProduct(item);

        // 3. Mehsulu axirinci melumatlar (stoklar ve s.) ile reload edib indexe gonder
        const reloadedProduct = await this.productsRepository.findOne({
          where: { id: product.id },
          relations: ['stocks', 'category'],
        });

        if (reloadedProduct) {
          await this.searchService.indexProduct(reloadedProduct);
          this.logger.log(
            `Məhsul (${reloadedProduct.sku}) axtarış indeksinə göndərildi. Stok: ${reloadedProduct.stocks?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0}`,
          );
        }

        results.push({
          sku: product.sku,
          status: 'success',
          productId: product.id,
          guid1c: product.guid1c,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Error syncing product ${item.sku}: ${message}`);
        results.push({
          sku: item.sku,
          status: 'error',
          message,
        });
      }
    }

    return { results, timestamp: new Date() };
  }

  private async syncSingleProduct(item: ProductSyncItem): Promise<Product> {
    // 1. Mehsulu tap (GUID vasitesile, yoxdursa SKU vasitesile)
    let product: Product | null = null;

    if (item.guid1c) {
      product = await this.productsRepository.findOne({
        where: { guid1c: item.guid1c },
        relations: ['stocks'],
      });
    }

    if (!product) {
      product = await this.productsRepository.findOne({
        where: { sku: item.sku },
        relations: ['stocks'],
      });
    }

    if (!product) {
      // Eger mehsul yoxdursa, yeni mehsul yarat
      product = this.productsRepository.create({
        sku: item.sku,
        guid1c: item.guid1c,
        name: item.name ?? 'Yeni Mehsul (1C-den geler)',
        price: Number(item.price) || 0,
        gender: item.gender,
        weight: Number(item.weight),
        barcode: item.barcode,
        variants: item.variants ?? {},
      });
      product = await this.productsRepository.save(product);
    } else {
      // Mehsulun GUID-i yoxdursa amma 1C-den gelibse, yenile
      if (item.guid1c && !product.guid1c) {
        product.guid1c = item.guid1c;
      }

      // Eger qiymet deyisibse, qiymet tarixcesine elave et
      if (
        Number(item.price) &&
        Math.abs(Number(item.price) - product.price) > 0.01
      ) {
        await this.priceHistoryRepository.save(
          this.priceHistoryRepository.create({
            price: product.price,
            product: { id: product.id } as Product,
          }),
        );
        product.price = Number(item.price);
      }
    }

    // --- ORTAQ SAHELER (Hem yaradilanda, hem de update olanda yenilenir) ---
    if (item.name) product.name = item.name;
    if (item.gender) product.gender = item.gender;
    if (item.weight) product.weight = Number(item.weight);
    if (item.barcode) product.barcode = item.barcode;
    if (item.variants) product.variants = item.variants;

    if (typeof item.isActive === 'boolean') {
      product.isActive = item.isActive;
    }

    if (item.category) {
      const cat = await this.getOrCreateCategory(item.category);
      product.category = cat;
      this.logger.log(
        `Məhsul (${product.sku}) kateqoriyaya bağlandı: ${cat.name} (ID: ${cat.id})`,
      );
    }

    if (item.brand) {
      const brand = await this.getOrCreateBrand(item.brand);
      product.brand = brand;
      this.logger.log(
        `Məhsul (${product.sku}) brendə bağlandı: ${brand.name} (ID: ${brand.id})`,
      );
    }

    product = await this.productsRepository.save(product);

    if (item.stocks && Array.isArray(item.stocks)) {
      for (const stockInfo of item.stocks) {
        // Find or create color variant
        let colorVariantId: number | undefined = undefined;
        if (stockInfo.color) {
          let colorVariant = await this.productColorVariantRepository.findOne({
            where: { productId: product.id, color: stockInfo.color },
          });

          if (!colorVariant) {
            colorVariant = await this.productColorVariantRepository.save(
              this.productColorVariantRepository.create({
                productId: product.id,
                color: stockInfo.color,
              }),
            );
          }
          colorVariantId = colorVariant.id;
        }

        // Find existing stock (variant) or create new
        let stock = await this.productStockRepository.findOne({
          where: {
            productId: product.id,
            size: stockInfo.size ?? undefined,
            colorVariantId: colorVariantId ?? undefined,
          },
        });

        if (stock) {
          stock.stock = Number(stockInfo.stock);
          await this.productStockRepository.save(stock);
        } else {
          stock = this.productStockRepository.create({
            productId: product.id,
            stock: Number(stockInfo.stock),
            size: stockInfo.size,
            colorVariantId: colorVariantId,
          });
          await this.productStockRepository.save(stock);
        }
      }
    }

    // 2.5 Endirim (Discount) melumatlarini yenile
    if (item.discount) {
      let discount = await this.discountRepository.findOne({
        where: { product: { id: product.id } },
      });

      if (!discount) {
        discount = this.discountRepository.create({
          product: { id: product.id } as any,
        });
      }

      discount.type =
        item.discount.type === 'fixed'
          ? DiscountType.FIXED
          : DiscountType.PERCENTAGE;
      discount.value = Number(item.discount.value);
      discount.startDate = item.discount.startDate
        ? new Date(item.discount.startDate)
        : null;
      discount.endDate = item.discount.endDate
        ? new Date(item.discount.endDate)
        : null;
      discount.isActive = true;

      await this.discountRepository.save(discount);
      this.logger.log(
        `Məhsul (${product.sku}) üçün endirim təyin olundu: ${discount.value} ${discount.type}`,
      );
    } else if (item.discount === null) {
      // 1C endirimi legh etmek isteyirse null gonderir
      await this.discountRepository.delete({ product: { id: product.id } });
    }

    // 3. Search Index-i yenile
    await this.searchService.indexProduct(product);

    return product;
  }

  /**
   * Yalniz stoklari yenilemek ucun (Satish olanda 1C-den geler)
   */
  async syncStocks(data: ProductSyncItem | ProductSyncItem[]) {
    return this.syncProducts(data); // Eyni mentiqi istifade edir
  }

  /**
   * Mehsulu sil (ve ya deaktiv et)
   */
  async deleteProduct(skuOrGuid: string) {
    this.logger.log(`Silmə sorğusu: ${skuOrGuid}`);
    let product = await this.productsRepository.findOne({
      where: { guid1c: skuOrGuid },
    });

    if (!product) {
      product = await this.productsRepository.findOne({
        where: { sku: skuOrGuid },
      });
    }

    if (!product) {
      this.logger.warn(`Silmə üçün məhsul tapılmadı: ${skuOrGuid}`);
      return { status: 'error', message: 'Mehsul tapilmadi' };
    }

    const sku = product.sku;
    this.logger.log(`Məhsul tapıldı, DB-dən silinir: ${sku}`);
    await this.productsRepository.remove(product);
    this.logger.log(`DB-dən silindi: ${sku}`);

    // Search indexinden de silerik (Hanging check)
    /*
    try {
      await this.searchService.removeProduct(product.id);
      this.logger.log(`Search index-dən silindi: ${sku}`);
    } catch (e) {
      this.logger.warn(`Search indexinden silerken xeta: ${e.message}`);
    }
    */

    return {
      status: 'success',
      sku,
      message: 'Mehsul bazadan tamamilə silindi',
    };
  }

  /**
   * 1C-den gelen kateqoriyalari sinxronize et
   */
  async syncCategories(data: CategorySyncItem | CategorySyncItem[]) {
    const categories = Array.isArray(data) ? data : [data];
    const results: any[] = [];

    for (const item of categories) {
      try {
        let parent: Category | null = null;
        if (item.parentGuid1c) {
          parent = await this.getOrCreateCategory(item.parentName || 'Yeni Üst Kateqoriya', null, item.parentGuid1c);
        } else if (item.parentName) {
          parent = await this.getOrCreateCategory(item.parentName);
        } else if (item.parentId) {
          parent = await this.categoryRepository.findOneBy({ id: item.parentId });
        }

        const category = await this.getOrCreateCategory(item.name, parent, item.guid1c);

        if (typeof item.isActive === 'boolean') {
          category.isActive = item.isActive;
        }
        if (item.sizeType) {
          category.sizeType = item.sizeType as SizeType;
        }
        if (item.guid1c && !category.guid1c) {
          category.guid1c = item.guid1c;
        }
        await this.categoryRepository.save(category);
        results.push({ name: item.name, status: 'success', id: category.id, guid1c: category.guid1c });
      } catch (error) {
        results.push({ name: item.name, status: 'error', message: error.message });
      }
    }

    this.categoriesService.clearCache();
    return { results, timestamp: new Date() };
  }



  /**
   * Bütün məhsulları 1C üçün gətir
   */
  async getProducts() {
    return this.productsRepository.find({
      relations: ['stocks', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Bütün kateqoriyaları gətir
   */
  async getCategories() {
    return this.categoryRepository.find({
      relations: ['parent'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Mövcud ölçü tiplərini gətir
   */
  async getSizeTypes() {
    return Object.values(SizeType);
  }

  private async getOrCreateCategory(
    name: string,
    parent?: Category | null,
    guid1c?: string,
  ): Promise<Category> {
    let category: Category | null = null;

    // 1. GUID ile tapmagi yoxla
    if (guid1c) {
      category = await this.categoryRepository.findOne({
        where: { guid1c },
        relations: ['parent'],
      });
    }

    // 2. Ad ile tapmagi yoxla (GUID tapilmadiqda)
    if (!category) {
      category = await this.categoryRepository.findOne({
        where: { name },
        relations: ['parent'],
      });
    }

    if (!category) {
      // Yeni yarat
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      category = this.categoryRepository.create({
        name,
        guid1c,
        slug: slug || `cat-${Date.now()}`,
        isActive: true,
      });
      if (parent) {
        category.parent = parent;
      }
      category = await this.categoryRepository.save(category);
      await this.searchService.indexCategory(category);
      this.categoriesService.clearCache();
    } else {
      // Yenile (GUID yoxdursa amma gelibse)
      let changed = false;
      if (guid1c && !category.guid1c) {
        category.guid1c = guid1c;
        changed = true;
      }
      if (parent && (!category.parent || category.parent.id !== parent.id)) {
        category.parent = parent;
        changed = true;
      }

      if (changed) {
        await this.categoryRepository.save(category);
        this.categoriesService.clearCache();
      }
    }

    return category;
  }

  private async getOrCreateBrand(nameOrGuid: string): Promise<Brand> {
    let brand = await this.brandRepository.findOne({
      where: [{ guid1c: nameOrGuid }, { name: nameOrGuid }],
    });

    if (!brand) {
      const slug = nameOrGuid
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      brand = this.brandRepository.create({
        name: nameOrGuid,
        guid1c: nameOrGuid,
        slug: slug || `brand-${Date.now()}`,
      });
      brand = await this.brandRepository.save(brand);
      this.logger.log(`Yeni brend yaradıldı: ${brand.name} (ID: ${brand.id})`);
    }

    return brand;
  }
}
