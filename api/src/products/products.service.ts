import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ErrorMessages } from '../common/constants/error-messages';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    // Kateqoriya ID-sini götürürük
    const { categoryId, ...productData } = createProductDto;
    // Məhsul obyektini yaradırıq
    const product = this.productsRepository.create({
      ...productData,
      category: categoryId ? { id: categoryId } : undefined,
    } as any);

    return this.productsRepository.save(product);
  }

  async findAll(query: any = {}) {
    const qb = this.productsRepository.createQueryBuilder('product');

    qb.leftJoinAndSelect('product.category', 'category');
    qb.leftJoinAndSelect('product.stocks', 'stocks');

    // 1. Kateqoriya üzrə filtr
    if (query.categoryId) {
      qb.andWhere('category.id = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    // 2. Qiymət aralığı (min - max)
    if (query.minPrice) {
      qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
    }
    if (query.maxPrice) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    // 3. Variantlar üzrə filtr (JSONB sahəsi: variants)
    // Diqqət: PostgreSQL-də JSONB sahəsindəki dəyəri oxumaq üçün ->> istifadə olunur.
    // Məsələn: variants->>'brand' = 'Nike'

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

    // Axtarış sözü (Search Query)
    if (query.search) {
      qb.andWhere('LOWER(product.name) LIKE LOWER(:search)', { search: `%${query.search}%` });
    }

    return qb.getMany();
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { categoryId, category, ...productData } = updateProductDto;
    const product = await this.findOne(id);

    this.productsRepository.merge(product, {
      ...productData,
      category: categoryId ? { id: categoryId } : undefined,
    } as any);

    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productsRepository.remove(product);
  }
}
