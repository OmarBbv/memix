import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { generateSlug } from '../common/utils/slug.util';
import { ErrorMessages } from '../common/constants/error-messages';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = generateSlug(createCategoryDto.name);

    const existing = await this.categoriesRepository.findOneBy({ slug });
    if (existing) {
      // If exact slug exists, maybe append random string or throw error?
      // But better to handle duplicate names
      throw new ConflictException('Bu kateqoriya artıq mövcuddur');
    }

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      slug,
    });
    return this.categoriesRepository.save(category);
  }

  async findAll() {
    return this.categoriesRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(ErrorMessages.CATEGORY_NOT_FOUND);
      // Note: Add CATEGORY_NOT_FOUND later
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (updateCategoryDto.name) {
      const slug = generateSlug(updateCategoryDto.name);
      category.slug = slug;
    }

    this.categoriesRepository.merge(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    return this.categoriesRepository.remove(category);
  }

  async getFilters(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(ErrorMessages.CATEGORY_NOT_FOUND);
    }

    const products = category.products;
    if (!products || products.length === 0) {
      return {
        brands: [],
        colors: [],
        sizes: [],
        priceRange: { min: 0, max: 0 },
      };
    }

    // Unikal Brendlər
    const brands = [
      ...new Set(
        products
          .map((p) => p.variants?.brand)
          .filter((v) => v !== undefined && v !== null && v !== ''),
      ),
    ];

    // Unikal Rənglər
    const colors = [
      ...new Set(
        products
          .map((p) => p.variants?.color)
          .filter((v) => v !== undefined && v !== null && v !== ''),
      ),
    ];

    // Unikal Ölçülər
    const sizes = [
      ...new Set(
        products
          .map((p) => p.variants?.size)
          .filter((v) => v !== undefined && v !== null && v !== ''),
      ),
    ];

    // Qiymət diapazonu
    const prices = products.map((p) => Number(p.price));
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    return {
      brands,
      colors,
      sizes,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
    };
  }
}
