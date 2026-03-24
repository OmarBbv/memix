import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { generateSlug } from '../common/utils/slug.util';
import { ErrorMessages } from '../common/constants/error-messages';
import { ensureFullUrl } from '../common/utils/file-url.util';
import { SearchService } from '../search/search.service';

@Injectable()
export class CategoriesService {
  private cachedTree: Category[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private readonly searchService: SearchService,
  ) {}

  private clearCache() {
    this.cachedTree = null;
    this.cacheTimestamp = 0;
  }

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
        .andWhere('"order" >= :newOrder AND "order" < :oldOrder', {
          newOrder,
          oldOrder,
        })
        .update()
        .set({ order: () => '"order" + 1' })
        .execute();
    } else if (newOrder > oldOrder) {
      await qb
        .andWhere('"order" > :oldOrder AND "order" <= :newOrder', {
          oldOrder,
          newOrder,
        })
        .update()
        .set({ order: () => '"order" - 1' })
        .execute();
    }
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 2;

    while (await this.categoriesRepository.findOneBy({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    image?: Express.Multer.File,
  ) {
    const { parentId, ...rest } = createCategoryDto;
    const formattedName = this.formatName(rest.name);
    const slug = await this.generateUniqueSlug(formattedName);

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

    const savedCategory = await this.categoriesRepository.save(category);
    await this.searchService.indexCategory(savedCategory);
    this.clearCache();

    return {
      ...savedCategory,
      imageUrl: ensureFullUrl(savedCategory.imageUrl),
    };
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
      imageUrl: ensureFullUrl(cat.imageUrl),
      name: this.formatName(cat.name),
      productsCount: cat.products?.length || 0,
    }));
  }

  private formatCategoryTree(
    category: Category,
    all: boolean = false,
  ): Category | null {
    if (!all && !category.isActive) return null;
    category.name = this.formatName(category.name);
    category.imageUrl = ensureFullUrl(category.imageUrl);
    if (category.children) {
      category.children = category.children
        .map((child) => this.formatCategoryTree(child, all))
        .filter((c): c is Category => c !== null);
    }
    return category;
  }

  async findTree(all: boolean = false) {
    if (!all && this.cachedTree && Date.now() - this.cacheTimestamp < this.CACHE_TTL) {
      return this.cachedTree;
    }

    const where: any = { parent: IsNull() };
    if (!all) {
      where.isActive = true;
    }

    const trees = await this.categoriesRepository.find({
      where,
      relations: ['children', 'children.children'],
      order: { order: 'ASC', id: 'ASC' },
    });

    const result = trees
      .map((tree) => this.formatCategoryTree(tree, all))
      .filter((t): t is Category => t !== null);

    if (!all) {
      this.cachedTree = result;
      this.cacheTimestamp = Date.now();
    }

    return result;
  }

  async findHomeCategories() {
    const categories = await this.categoriesRepository.find({
      where: { showOnHome: true, isActive: true },
      order: { order: 'ASC', id: 'ASC' },
    });

    return categories.map((cat) => ({
      ...cat,
      imageUrl: ensureFullUrl(cat.imageUrl),
      name: this.formatName(cat.name),
    }));
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    category.name = this.formatName(category.name);
    category.imageUrl = ensureFullUrl(category.imageUrl);
    return category;
  }

  async findBySlug(
    slug: string,
    filters: Record<string, string> = {},
  ): Promise<any> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
      relations: [
        'parent',
        'children',
        'children.children',
        'children.children.children',
      ],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    const categoryIds = this.getIdsFromTree(category);
    const { subcategory, price, minPrice, maxPrice, page: pageParam, limit: limitParam, ...variantFilters } =
      filters;

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 12;

    const productRepo =
      this.categoriesRepository.manager.getRepository(Product);
    let qb = productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.discount', 'discount')
      .leftJoinAndSelect('product.stocks', 'stocks')
      .leftJoinAndSelect('stocks.branch', 'branch')
      .where('product.categoryId IN (:...categoryIds)', { categoryIds })
      .orderBy('product.createdAt', 'DESC');

    if (subcategory) {
      const subcategoryNames = subcategory.split(',').map((s) => s.trim());
      qb = qb.andWhere('category.name IN (:...subcategoryNames)', {
        subcategoryNames,
      });
    }

    if (minPrice) {
      qb = qb.andWhere('CAST(product.price AS NUMERIC) >= :minPriceVal', {
        minPriceVal: Number(minPrice),
      });
    }
    if (maxPrice) {
      qb = qb.andWhere('CAST(product.price AS NUMERIC) <= :maxPriceVal', {
        maxPriceVal: Number(maxPrice),
      });
    }

    if (price) {
      const priceConditions: string[] = [];
      const priceParams: Record<string, number> = {};

      price.split(',').forEach((range, i) => {
        const match = range.match(/([\d.]+)\s*-\s*([\d.]+)/);
        if (match) {
          priceConditions.push(
            `(CAST(product.price AS NUMERIC) >= :minPrice${i} AND CAST(product.price AS NUMERIC) <= :maxPrice${i})`,
          );
          priceParams[`minPrice${i}`] = Number(match[1]);
          priceParams[`maxPrice${i}`] = Number(match[2]);
        }
      });

      if (priceConditions.length > 0) {
        qb = qb.andWhere(`(${priceConditions.join(' OR ')})`, priceParams);
      }
    }

    Object.entries(variantFilters).forEach(([key, value]) => {
      if (!value) return;
      const values = Array.isArray(value) ? value : value.split(',').map((v) => v.trim());

      if (key === 'color' || key === 'size') {
         qb = qb.andWhere(
           `(product.variants->>:key_${key} IN (:...valArr_${key}) OR stocks.${key} IN (:...valArr_${key}))`,
           {
             [`key_${key}`]: key,
             [`valArr_${key}`]: values,
           }
         );
      } else {
        const conditions = values.map(
          (v, i) =>
            `(product.variants->>:key_${key} = :val_${key}_${i} OR product.variants->:key_${key} @> :valArrJSON_${key}_${i}::jsonb)`
        );
        const params: Record<string, any> = { [`key_${key}`]: key };
        values.forEach((v, i) => {
          params[`val_${key}_${i}`] = v;
          params[`valArrJSON_${key}_${i}`] = JSON.stringify([v]);
        });
        qb = qb.andWhere(`(${conditions.join(' OR ')})`, params);
      }
    });

    const total = await qb.getCount();
    const allProducts = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    category.products = allProducts.map(
      (product) =>
        ({
          ...product,
          banner: ensureFullUrl(product.banner),
          images: Array.isArray(product.images)
            ? (product.images
                .map((img) => ensureFullUrl(img))
                .filter(Boolean) as string[])
            : product.images,
        }) as any,
    );
    const responseCategory: any = {
      ...category,
      imageUrl: ensureFullUrl(category.imageUrl),
      name: this.formatName(category.name),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      }
    };

    return responseCategory;
  }

  private getIdsFromTree(category: Category): number[] {
    let ids = [category.id];
    if (category.children) {
      category.children.forEach((child) => {
        ids = [...ids, ...this.getIdsFromTree(child)];
      });
    }
    return ids;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    image?: Express.Multer.File,
  ) {
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
    const updatedCategory = await this.categoriesRepository.save(category);
    await this.searchService.indexCategory(updatedCategory);
    this.clearCache();

    return {
      ...updatedCategory,
      imageUrl: ensureFullUrl(updatedCategory.imageUrl),
    };
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
    await this.searchService.removeCategory(id);
    this.clearCache();
    return category;
  }

  async getFilters(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: [
        'children',
        'children.children',
        'children.children.children',
      ],
    });

    if (!category) {
      throw new NotFoundException(ErrorMessages.CATEGORY_NOT_FOUND);
    }

    const categoryIds = this.getIdsFromTree(category);

    const products = await this.categoriesRepository.manager
      .getRepository(Product)
      .find({
        where: { category: { id: In(categoryIds) } },
        relations: ['stocks'],
      });

    if (!products || products.length === 0) {
      return {
        filters: {},
        priceRange: { min: 0, max: 0 },
      };
    }

    const dynamicFilters: Record<string, any[]> = {};

    products.forEach((product) => {
      // Extract from variants JSON
      if (product.variants && typeof product.variants === 'object') {
        Object.entries(product.variants).forEach(([key, value]) => {
          if (!dynamicFilters[key]) {
            dynamicFilters[key] = [];
          }

          if (Array.isArray(value)) {
            dynamicFilters[key].push(...value);
          } else if (value !== null && value !== undefined && value !== '') {
            if (typeof value === 'boolean') {
              dynamicFilters[key].push(value ? 'Bəli' : 'Xeyr');
            } else {
              dynamicFilters[key].push(value);
            }
          }
        });
      }

      // Extract from ProductStock (Trendyol model)
      if (product.stocks && Array.isArray(product.stocks)) {
        product.stocks.forEach((stock) => {
          if (stock.color) {
            if (!dynamicFilters['color']) dynamicFilters['color'] = [];
            dynamicFilters['color'].push(stock.color);
          }
          if (stock.size) {
            if (!dynamicFilters['size']) dynamicFilters['size'] = [];
            dynamicFilters['size'].push(stock.size);
          }
        });
      }
    });

    const filters = Object.entries(dynamicFilters).reduce(
      (acc, [key, values]) => {
        const uniqueValues = [...new Set(values)].filter(
          (v) => v !== null && v !== '',
        );
        if (uniqueValues.length > 0) {
          acc[key] = uniqueValues;
        }
        return acc;
      },
      {} as Record<string, any[]>,
    );

    const prices = products.map((p) => Number(p.price));
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    return {
      filters,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
    };
  }

  async syncSearchIndex() {
    const categories = await this.categoriesRepository.find();
    for (const category of categories) {
      await this.searchService.indexCategory(category);
    }
    return {
      count: categories.length,
      message: 'Categories indexed successfully',
    };
  }
}
