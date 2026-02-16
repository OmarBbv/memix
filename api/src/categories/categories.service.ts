import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
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

  private formatName(name: string): string {
    if (!name) return name;
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  private async smartReorder(
    parentId: number | null,
    newOrder: number,
    oldOrder?: number | null,
  ) {
    const qb = this.categoriesRepository.createQueryBuilder('category');

    // Parent şərti
    if (parentId) {
      qb.where('"parentId" = :parentId', { parentId });
    } else {
      qb.where('"parentId" IS NULL');
    }

    if (oldOrder === undefined || oldOrder === null) {
      await qb
        .andWhere('"order" >= :newOrder', { newOrder })
        .update()
        .set({ order: () => '"order" + 1' })
        .execute();
    } else if (newOrder < oldOrder) {
      await qb
        .andWhere('"order" >= :newOrder AND "order" < :oldOrder', { newOrder, oldOrder })
        .update()
        .set({ order: () => '"order" + 1' })
        .execute();
    } else if (newOrder > oldOrder) {
      await qb
        .andWhere('"order" > :oldOrder AND "order" <= :newOrder', { oldOrder, newOrder })
        .update()
        .set({ order: () => '"order" - 1' })
        .execute();
    }
  }

  async create(createCategoryDto: CreateCategoryDto, image?: Express.Multer.File) {
    const { parentId, ...rest } = createCategoryDto;
    const formattedName = this.formatName(rest.name);
    const slug = generateSlug(formattedName);

    const existing = await this.categoriesRepository.findOneBy({ slug });
    if (existing) {
      throw new ConflictException('Bu kateqoriya artıq mövcuddur');
    }

    if (rest.order !== undefined) {
      await this.smartReorder(parentId || null, rest.order);
    }

    const imageUrl = image ? `/uploads/${image.filename}` : rest.imageUrl;

    const category = this.categoriesRepository.create({
      ...rest,
      name: formattedName,
      slug,
      imageUrl,
    });

    if (parentId) {
      category.parent = { id: parentId } as Category;
    }

    return this.categoriesRepository.save(category);
  }

  async findAll(all: boolean = false) {
    const where: any = {};
    if (!all) {
      where.isActive = true;
    }

    const categories = await this.categoriesRepository.find({
      where,
      relations: ['parent', 'products'],
      order: { order: 'ASC', id: 'ASC' },
    });
    return categories.map((cat) => ({
      ...cat,
      name: this.formatName(cat.name),
      productsCount: cat.products?.length || 0,
    }));
  }

  private formatCategoryTree(category: Category, all: boolean = false): Category | null {
    if (!all && !category.isActive) return null;
    category.name = this.formatName(category.name);
    if (category.children) {
      category.children = category.children
        .map((child) => this.formatCategoryTree(child, all))
        .filter((c): c is Category => c !== null);
    }
    return category;
  }

  async findTree(all: boolean = false) {
    const where: any = { parent: IsNull() };
    if (!all) {
      where.isActive = true;
    }

    const trees = await this.categoriesRepository.find({
      where,
      relations: ['children', 'children.children'],
      order: { order: 'ASC', id: 'ASC' },
    });

    return trees
      .map((tree) => this.formatCategoryTree(tree, all))
      .filter((t): t is Category => t !== null);
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(ErrorMessages.CATEGORY_NOT_FOUND);
    }
    category.name = this.formatName(category.name);
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, image?: Express.Multer.File) {
    const category = await this.findOne(id);
    const { parentId, ...rest } = updateCategoryDto;

    if (rest.order !== undefined && rest.order !== category.order) {
      const pId =
        parentId !== undefined ? parentId : category.parent?.id || null;
      await this.smartReorder(pId as any, rest.order, category.order);
    }

    if (rest.name) {
      const formattedName = this.formatName(rest.name);
      category.name = formattedName;
      category.slug = generateSlug(formattedName);
    }

    if (image) {
      category.imageUrl = `/uploads/${image.filename}`;
    }

    if (parentId !== undefined) {
      category.parent = parentId
        ? ({ id: parentId } as Category)
        : (null as any);
    }

    this.categoriesRepository.merge(category, rest);
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
