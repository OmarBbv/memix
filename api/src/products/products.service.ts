import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ErrorMessages } from '../common/constants/error-messages';
import { SearchService } from '../search/search.service';
import { ensureFullUrl } from '../common/utils/file-url.util';
import { PriceHistory } from './entities/price-history.entity';
import { ProductStock } from '../branches/entities/product-stock.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
    @InjectRepository(ProductStock)
    private productStockRepository: Repository<ProductStock>,
    private readonly searchService: SearchService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files?: {
      banner?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    const { categoryId, variants, tags, branchStocks, ...productData } =
      createProductDto;

    const appUrl = process.env.APP_URL || 'http://localhost:4444';

    let bannerUrl: string | null = null;
    if (files?.banner && files.banner.length > 0) {
      bannerUrl = `${appUrl}/uploads/${files.banner[0].filename}`;
    }

    const imageUrls: string[] = [];
    if (files?.images) {
      files.images.forEach((file) => {
        imageUrls.push(`${appUrl}/uploads/${file.filename}`);
      });
    }

    let parsedVariants = variants;
    if (typeof variants === 'string') {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (e) {
        parsedVariants = {};
      }
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    const product = this.productsRepository.create({
      ...productData,
      banner: bannerUrl,
      images: imageUrls.length > 0 ? imageUrls : undefined,
      variants: parsedVariants,
      tags: parsedTags,
      category: categoryId ? { id: Number(categoryId) } : undefined,
      price: Number(productData.price),
    } as any) as unknown as Product;

    const savedProduct = await this.productsRepository.save(product);

    // Handle Branch Stocks
    let parsedBranchStocks = branchStocks;
    if (typeof branchStocks === 'string') {
      try {
        parsedBranchStocks = JSON.parse(branchStocks);
      } catch (e) {
        parsedBranchStocks = [];
      }
    }

    if (Array.isArray(parsedBranchStocks)) {
      const stockEntities = parsedBranchStocks.map((bs) =>
        this.productStockRepository.create({
          product: { id: savedProduct.id } as any,
          productId: savedProduct.id,
          branch: { id: Number(bs.branchId) } as any,
          branchId: Number(bs.branchId),
          stock: Number(bs.stock) || 0,
          size: bs.size || undefined,
          color: bs.color || undefined,
        }),
      );
      await this.productStockRepository.save(stockEntities);
    }

    await this.searchService.indexProduct(savedProduct);

    return {
      ...savedProduct,
      banner: ensureFullUrl(savedProduct.banner),
      images: Array.isArray(savedProduct.images)
        ? savedProduct.images.map((img) => ensureFullUrl(img)).filter(Boolean)
        : savedProduct.images,
    };
  }

  async findAll(query: any = {}) {
    let products: Product[];

    if (query.search) {
      const searchResults = await this.searchService.search(query.search);
      const productIds = searchResults
        .filter((r) => r.type === 'product')
        .map((p) => p.id);
      const categoryIds = searchResults
        .filter((r) => r.type === 'category')
        .map((c) => c.id);

      let fetchedProducts: Product[] = [];
      if (productIds.length > 0) {
        fetchedProducts = await this.productsRepository
          .createQueryBuilder('product')
          .whereInIds(productIds)
          .leftJoinAndSelect('product.category', 'category')
          .leftJoinAndSelect('product.discount', 'discount')
          .leftJoinAndSelect('product.priceHistory', 'priceHistory')
          .leftJoinAndSelect('product.stocks', 'stocks')
          .leftJoinAndSelect('stocks.branch', 'branch')
          .getMany();
      }

      // We can also fetch categories from DB if we want full data, or just use ES data.
      // For simplicity/speed, let's use the ES data for categories since it has name/slug/image/id
      const categories = searchResults.filter((r) => r.type === 'category');

      // Sort or merge? preserve ES order?
      // ES returns sorted by relevance. We should try to respect that.
      // Create a map for quick lookup
      const productMap = new Map(fetchedProducts.map((p) => [p.id, p]));

      const finalResults: (Product | any)[] = [];
      for (const result of searchResults) {
        if (result.type === 'product') {
          const p = productMap.get(result.id);
          if (p) finalResults.push(p);
        } else if (result.type === 'category') {
          finalResults.push(result);
        }
      }

      products = finalResults as any;
    } else {
      const qb = this.productsRepository.createQueryBuilder('product');

      qb.leftJoinAndSelect('product.category', 'category');
      qb.leftJoinAndSelect('product.stocks', 'stocks');
      qb.leftJoinAndSelect('stocks.branch', 'branch');
      qb.leftJoinAndSelect('product.discount', 'discount');
      qb.leftJoinAndSelect('product.priceHistory', 'priceHistory');

      if (query.categoryId) {
        qb.andWhere('category.id = :categoryId', {
          categoryId: query.categoryId,
        });
      }

      if (query.minPrice) {
        qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
      }
      if (query.maxPrice) {
        qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
      }

      if (query.brand) {
        const brands = Array.isArray(query.brand) 
          ? query.brand 
          : query.brand.split(',').map((b: string) => b.trim());
        qb.andWhere(`product.variants ->> 'brand' IN (:...brands)`, { brands });
      }

      if (query.color) {
        const colors = Array.isArray(query.color) 
          ? query.color 
          : query.color.split(',').map((c: string) => c.trim());
        qb.andWhere(
          `(product.variants ->> 'color' IN (:...colors) OR stocks.color IN (:...colors))`,
          { colors }
        );
      }

      if (query.size) {
        const sizes = Array.isArray(query.size) 
          ? query.size 
          : query.size.split(',').map((s: string) => s.trim());
        qb.andWhere(
          `(product.variants ->> 'size' IN (:...sizes) OR stocks.size IN (:...sizes))`,
          { sizes }
        );
      }

      products = await qb.getMany();
    }

    return products.map((product) => ({
      ...product,
      banner: ensureFullUrl(product.banner),
      images: Array.isArray(product.images)
        ? product.images.map((img) => ensureFullUrl(img)).filter(Boolean)
        : product.images,
    }));
  }

  async findNewArrivals(limit: number = 8) {
    const products = await this.productsRepository.find({
      relations: ['category', 'discount', 'priceHistory'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return products.map((product) => ({
      ...product,
      banner: ensureFullUrl(product.banner),
      images: Array.isArray(product.images)
        ? product.images.map((img) => ensureFullUrl(img)).filter(Boolean)
        : product.images,
    }));
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: [
        'category',
        'discount',
        'priceHistory',
        'stocks',
        'stocks.branch',
      ],
      order: {
        priceHistory: {
          changedAt: 'DESC',
        },
      } as any,
    });

    if (!product) {
      throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
    }

    return {
      ...product,
      banner: ensureFullUrl(product.banner),
      images: Array.isArray(product.images)
        ? (product.images
            .map((img) => ensureFullUrl(img))
            .filter(Boolean) as string[])
        : product.images,
    } as any;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    files?: {
      banner?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    try {
      const {
        categoryId,
        variants,
        tags,
        branchStocks,
        existingBanner,
        existingImages,
        ...productData
      } = updateProductDto;

      // Use specific findOne to avoid loading priceHistory relation which causes cascade delete issues
      const product = await this.productsRepository.findOne({
        where: { id },
        relations: ['category', 'discount', 'stocks', 'stocks.branch'],
        order: {
          stocks: { id: 'ASC' },
        } as any,
      });

      if (!product) {
        throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
      }

      const appUrl = process.env.APP_URL || 'http://localhost:4444';

      let bannerUrl = product.banner;
      if (files?.banner && files.banner.length > 0) {
        bannerUrl = `${appUrl}/uploads/${files.banner[0].filename}`;
      } else if (existingBanner === undefined) {
        bannerUrl = null;
      } else {
        bannerUrl = existingBanner;
      }

      let finalImages: string[] = [];

      if (existingImages) {
        if (Array.isArray(existingImages)) {
          finalImages = [...existingImages];
        } else if (typeof existingImages === 'string') {
          finalImages = [existingImages];
        }
      }

      if (files?.images) {
        files.images.forEach((file) => {
          finalImages.push(`${appUrl}/uploads/${file.filename}`);
        });
      }

      let parsedVariants = variants;
      if (typeof variants === 'string') {
        try {
          parsedVariants = JSON.parse(variants);
        } catch (e) {
          parsedVariants = product.variants;
        }
      }

      let parsedTags = tags;
      if (typeof tags === 'string') {
        parsedTags = tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }

      if (productData.price) {
        const newPrice = Number(productData.price);
        const oldPrice = Number(product.price);

        if (
          !isNaN(newPrice) &&
          !isNaN(oldPrice) &&
          Math.abs(newPrice - oldPrice) > 0.01
        ) {
          // Verify productRef exists before saving history
          if (product) {
            await this.priceHistoryRepository.save(
              this.priceHistoryRepository.create({
                price: oldPrice,
                product: { id: product.id } as Product,
              }),
            );
          }
        }
      }
      // Handle Branch Stocks
      let parsedBranchStocks = branchStocks;
      if (typeof branchStocks === 'string') {
        try {
          parsedBranchStocks = JSON.parse(branchStocks);
        } catch (e) {
          parsedBranchStocks = [];
        }
      }

      if (Array.isArray(parsedBranchStocks)) {
        // Clear existing stocks or update selectively? Simple way: clear and recreate
        await this.productStockRepository.delete({ productId: product.id });
        const stockEntities = parsedBranchStocks
          .filter((bs) => Number(bs.branchId) > 0)
          .map((bs) =>
            this.productStockRepository.create({
              product: { id: product.id } as any,
              productId: product.id,
              branch: { id: Number(bs.branchId) } as any,
              branchId: Number(bs.branchId),
              stock: Number(bs.stock) || 0,
              size: bs.size || undefined,
              color: bs.color || undefined,
            }),
          );
        await this.productStockRepository.save(stockEntities);
      }

      // Clear stale stocks from the product object to prevent TypeORM from trying to save them
      product.stocks = [];
      // product.priceHistory is not loaded, so it remains undefined, which is what we want.

      this.productsRepository.merge(product, {
        ...productData,
        banner: bannerUrl,
        images: finalImages,
        variants: parsedVariants,
        tags: parsedTags,
        category: categoryId ? { id: Number(categoryId) } : product.category,
        price: productData.price ? Number(productData.price) : product.price,
      } as any);

      const updatedProduct = await this.productsRepository.save(product);
      await this.searchService.indexProduct(updatedProduct);

      return {
        ...updatedProduct,
        banner: ensureFullUrl(updatedProduct.banner),
        images: Array.isArray(updatedProduct.images)
          ? updatedProduct.images
              .map((img) => ensureFullUrl(img))
              .filter(Boolean)
          : updatedProduct.images,
      };
    } catch (e) {
      throw new NotFoundException(`UPDATE ERROR: ${e.message}`);
    }
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    await this.searchService.removeProduct(id);
    return product;
  }

  async syncSearchIndex() {
    const products = await this.productsRepository.find({
      relations: ['category', 'discount', 'stocks', 'stocks.branch'],
    });

    const chunkSize = 100;
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize);
      await this.searchService.indexProducts(chunk as any);
    }

    return { count: products.length, message: 'Products indexed successfully' };
  }
}
