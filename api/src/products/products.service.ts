import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ErrorMessages } from '../common/constants/error-messages';
import { SearchService } from '../search/search.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private readonly searchService: SearchService,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const { categoryId, ...productData } = createProductDto;

    const product = this.productsRepository.create({
      ...productData,
      category: categoryId ? { id: categoryId } : undefined,
    } as any) as unknown as Product;

    const savedProduct = await this.productsRepository.save(product);

    await this.searchService.indexProduct(savedProduct);

    return savedProduct;
  }

  async findAll(query: any = {}) {
    if (query.search) {
      const searchResults = await this.searchService.search(query.search);
      const ids = (searchResults as any[]).map(p => p.id);
      if (ids.length === 0) return [];

      return this.productsRepository.createQueryBuilder('product')
        .whereInIds(ids)
        .leftJoinAndSelect('product.category', 'category')
        .getMany();
    }

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

    const updatedProduct = await this.productsRepository.save(product) as Product;

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
