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
  ) { }

  async create(
    createProductDto: CreateProductDto,
    files?: {
      banner?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    const { categoryId, variants, tags, branchStocks, ...productData } = createProductDto;

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
      parsedTags = (tags as string).split(',').map(t => t.trim()).filter(Boolean);
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
      const stockEntities = parsedBranchStocks.map(bs => this.productStockRepository.create({
        productId: savedProduct.id,
        branchId: Number(bs.branchId),
        stock: Number(bs.stock) || 0
      }));
      await this.productStockRepository.save(stockEntities);
    }

    await this.searchService.indexProduct(savedProduct);

    return {
      ...savedProduct,
      banner: ensureFullUrl(savedProduct.banner),
      images: Array.isArray(savedProduct.images)
        ? savedProduct.images.map(img => ensureFullUrl(img)).filter(Boolean)
        : savedProduct.images,
    };
  }

  async findAll(query: any = {}) {
    let products: Product[];

    if (query.search) {
      const searchResults = await this.searchService.search(query.search);
      const ids = (searchResults as any[]).map(p => p.id);
      if (ids.length === 0) return [];

      products = await this.productsRepository.createQueryBuilder('product')
        .whereInIds(ids)
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.discount', 'discount')
        .leftJoinAndSelect('product.priceHistory', 'priceHistory')
        .leftJoinAndSelect('product.stocks', 'stocks')
        .leftJoinAndSelect('stocks.branch', 'branch')
        .getMany();
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
        qb.andWhere(`product.variants ->> 'brand' = :brand`, {
          brand: query.brand,
        });
      }

      if (query.color) {
        qb.andWhere(`product.variants ->> 'color' = :color`, {
          color: query.color,
        });
      }

      if (query.size) {
        qb.andWhere(`product.variants ->> 'size' = :size`, {
          size: query.size,
        });
      }

      products = await qb.getMany();
    }

    return products.map(product => ({
      ...product,
      banner: ensureFullUrl(product.banner),
      images: Array.isArray(product.images)
        ? (product.images.map(img => ensureFullUrl(img)).filter(Boolean) as string[])
        : product.images,
    } as any));
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'discount', 'priceHistory', 'stocks', 'stocks.branch'],
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
        ? (product.images.map(img => ensureFullUrl(img)).filter(Boolean) as string[])
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
    const {
      categoryId,
      variants,
      tags,
      branchStocks,
      existingBanner,
      existingImages,
      ...productData
    } = updateProductDto;

    const product = await this.findOne(id);
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
      parsedTags = (tags as string).split(',').map(t => t.trim()).filter(Boolean);
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    if (productData.price) {
      const newPrice = Number(productData.price);
      const oldPrice = Number(product.price);

      if (!isNaN(newPrice) && !isNaN(oldPrice) && Math.abs(newPrice - oldPrice) > 0.01) {
        await this.priceHistoryRepository.save({
          price: oldPrice,
          product: { id: product.id } as Product
        });
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
      const stockEntities = parsedBranchStocks.map(bs => this.productStockRepository.create({
        productId: product.id,
        branchId: Number(bs.branchId),
        stock: Number(bs.stock) || 0
      }));
      await this.productStockRepository.save(stockEntities);
    }

    this.productsRepository.merge(product, {
      ...productData,
      banner: bannerUrl,
      images: finalImages,
      variants: parsedVariants,
      tags: parsedTags,
      category: categoryId ? { id: Number(categoryId) } : product.category,
      price: productData.price ? Number(productData.price) : product.price,
    } as any);

    const updatedProduct = (await this.productsRepository.save(product)) as Product;
    await this.searchService.indexProduct(updatedProduct);

    return {
      ...updatedProduct,
      banner: ensureFullUrl(updatedProduct.banner),
      images: Array.isArray(updatedProduct.images)
        ? updatedProduct.images.map(img => ensureFullUrl(img)).filter(Boolean)
        : updatedProduct.images,
    };
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    await this.searchService.removeProduct(id);
    return product;
  }
}
