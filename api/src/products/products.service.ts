import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ErrorMessages } from '../common/constants/error-messages';
import { SearchService } from '../search/search.service';

import { ensureFullUrl } from '../common/utils/file-url.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private readonly searchService: SearchService,
  ) { }

  async create(
    createProductDto: CreateProductDto,
    files?: {
      banner?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    const { categoryId, variants, tags, ...productData } = createProductDto;

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

    // FormData-dan gələn string dataları parse edirik
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
      stock: productData.stock ? Number(productData.stock) : 0,
    } as any) as unknown as Product;

    const savedProduct = await this.productsRepository.save(product);

    await this.searchService.indexProduct(savedProduct);

    return savedProduct;
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
        .getMany();
    } else {
      const qb = this.productsRepository.createQueryBuilder('product');

      qb.leftJoinAndSelect('product.category', 'category');
      qb.leftJoinAndSelect('product.stocks', 'stocks');

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

    // URL-ləri tam formata salırıq
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
      relations: ['category'],
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

    this.productsRepository.merge(product, {
      ...productData,
      banner: bannerUrl,
      images: finalImages,
      variants: parsedVariants,
      tags: parsedTags,
      category: categoryId ? { id: Number(categoryId) } : product.category,
      price: productData.price ? Number(productData.price) : product.price,
      stock: productData.stock !== undefined ? Number(productData.stock) : product.stock,
    } as any);

    const updatedProduct = (await this.productsRepository.save(product)) as Product;

    await this.searchService.indexProduct(updatedProduct);

    return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);

    await this.searchService.removeProduct(id);

    return product;
  }
}
