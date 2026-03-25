import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductStock } from '../branches/entities/product-stock.entity';
import { Branch } from '../branches/entities/branch.entity';
import { PriceHistory } from '../products/entities/price-history.entity';
import { SearchService } from '../search/search.service';

// 1C inteqrasiyası üçün giriş tipləri
export interface StockInfo {
  branchId?: number;
  branchName?: string;
  branchGuid?: string; // 1C-den gelen GUID
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
  variants?: Record<string, unknown>;
  stocks?: StockInfo[];
}

export interface SyncResult {
  sku: string;
  status: 'success' | 'error';
  productId?: number;
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
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
    private readonly searchService: SearchService,
  ) {}

  /**
   * 1C-den gelen mehsullari ve stoklari sinxronize et
   */
  async syncProducts(data: ProductSyncItem | ProductSyncItem[]) {
    const products = Array.isArray(data) ? data : [data];
    const results: SyncResult[] = [];

    for (const item of products) {
      try {
        const product = await this.syncSingleProduct(item);
        results.push({
          sku: item.sku,
          status: 'success',
          productId: product.id,
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

      // Mehsulun melumatlarini yenile
      if (item.name) product.name = item.name;
      if (item.gender) product.gender = item.gender;
      if (item.weight) product.weight = Number(item.weight);
      if (item.barcode) product.barcode = item.barcode;

      product = await this.productsRepository.save(product);
    }

    // 2. Stoklari (Branch Stocks) yenile
    if (item.stocks && Array.isArray(item.stocks)) {
      for (const stockInfo of item.stocks) {
        // Filiali tap (GUID, ID ve ya Ad ile)
        let branch: Branch | null = null;
        if (stockInfo.branchGuid) {
          branch = await this.branchRepository.findOne({
            where: { guid1c: stockInfo.branchGuid },
          });
        }

        if (!branch && stockInfo.branchId) {
          branch = await this.branchRepository.findOne({
            where: { id: stockInfo.branchId },
          });
        } else if (!branch && stockInfo.branchName) {
          branch = await this.branchRepository.findOne({
            where: { name: stockInfo.branchName },
          });
        }

        if (branch) {
          // Filialin GUID-i yoxdursa yenile
          if (stockInfo.branchGuid && !branch.guid1c) {
            branch.guid1c = stockInfo.branchGuid;
            await this.branchRepository.save(branch);
          }

          // Mevcud stoku tap ve ya yenisini yarat
          let stock = await this.productStockRepository.findOne({
            where: {
              productId: product.id,
              branchId: branch.id,
              size: stockInfo.size ?? undefined,
              color: stockInfo.color ?? undefined,
            },
          });

          if (stock) {
            stock.stock = Number(stockInfo.stock);
            await this.productStockRepository.save(stock);
          } else {
            stock = this.productStockRepository.create({
              productId: product.id,
              branchId: branch.id,
              stock: Number(stockInfo.stock),
              size: stockInfo.size,
              color: stockInfo.color,
            });
            await this.productStockRepository.save(stock);
          }
        }
      }
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
}
