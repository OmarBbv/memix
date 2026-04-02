import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ErrorMessages } from '../common/constants/error-messages';
import { SearchService } from '../search/search.service';
import { ensureFullUrl } from '../common/utils/file-url.util';
import { PriceHistory } from './entities/price-history.entity';
import { ProductStock } from './entities/product-stock.entity';
import { ProductColorVariant } from './entities/product-color-variant.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
    @InjectRepository(ProductStock)
    private productStockRepository: Repository<ProductStock>,
    @InjectRepository(ProductColorVariant)
    private productColorVariantRepository: Repository<ProductColorVariant>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly searchService: SearchService,
  ) { }

  private async generateUniqueBarcode(): Promise<string> {
    let barcode: string = '';
    let isUnique = false;

    while (!isUnique) {
      // 20 + 11 rəqəmli unikal barkod (EAN-13 formatına uyğun)
      const timestamp = Date.now().toString().slice(-8); // Son 8 rəqəm
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 rəqəmli təsadüfi
      barcode = `20${timestamp}${random}`; // Toplam 13 rəqəm

      const exists = await this.productsRepository.findOne({
        where: { barcode },
      });

      if (!exists) {
        isUnique = true;
      }
    }

    return barcode;
  }

  async generateSKU(categoryId: number, listingType: string): Promise<{ sku: string | null; error?: string }> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      return { sku: null, error: 'Kateqoriya tapılmadı' };
    }

    const prefix = listingType === 'used' ? category.skuPrefixUsed : category.skuPrefixNew;
    if (!prefix) {
      return { sku: null, error: 'Bu kateqoriyanın seçilmiş növü (Yeni/İşlənmiş) üçün kod təyin edilməyib.' };
    }

    const existingProducts = await this.productsRepository
      .createQueryBuilder('product')
      .where('product.sku LIKE :pattern', { pattern: `${prefix}%` })
      .getMany();

    let maxSeq = 0;
    for (const prod of existingProducts) {
      if (prod.sku) {
        const seqStr = prod.sku.replace(prefix, '');
        const seqNum = parseInt(seqStr, 10);
        if (!isNaN(seqNum) && seqNum > maxSeq) {
          maxSeq = seqNum;
        }
      }
    }

    const nextSeq = maxSeq + 1;
    const paddedSeq = nextSeq.toString().padStart(3, '0');
    return { sku: `${prefix}${paddedSeq}` };
  }

  async create(
    createProductDto: any,
    files?: Express.Multer.File[],
  ) {
    const { categoryId, brandId, variants, tags, colorVariants, ...productData } =
      createProductDto;

    const appUrl = process.env.APP_URL || 'http://localhost:4444';

    let bannerUrl: string | null = null;
    const bannerFile = files?.find(f => f.fieldname === 'banner');
    if (bannerFile) {
      bannerUrl = `${appUrl}/uploads/${bannerFile.filename}`;
    }

    const imageUrls: string[] = [];
    const generalImages = files?.filter(f => f.fieldname === 'images') || [];
    generalImages.forEach((file) => {
      imageUrls.push(`${appUrl}/uploads/${file.filename}`);
    });

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

    let finalBarcode = productData.barcode;
    if (!finalBarcode || finalBarcode.trim() === '') {
      finalBarcode = await this.generateUniqueBarcode();
    }

    const product = this.productsRepository.create({
      ...productData,
      barcode: finalBarcode,
      banner: bannerUrl,
      images: imageUrls.length > 0 ? imageUrls : undefined,
      variants: parsedVariants,
      tags: parsedTags,
      category: categoryId ? { id: Number(categoryId) } : undefined,
      brand: brandId ? { id: Number(brandId) } : undefined,
      price: Number(productData.price),
    } as any) as unknown as Product;

    let savedProduct: Product;
    try {
      savedProduct = await this.productsRepository.save(product);
    } catch (error) {
      if (error.code === "23505") {
        if (error.detail?.includes("sku")) {
          throw new ConflictException("Bu SKU (Məhsul Kodu) artıq istifadə olunub.");
        }
        if (error.detail?.includes("guid1c")) {
          throw new ConflictException("Bu GUID artıq bazada mövcuddur.");
        }
        throw new ConflictException("Bu məlumat bazada təkrarlandığı üçün (Duplicate) qəbul edilmədi.");
      }
      throw error;
    }

    // Handle Color-based Variants & Stocks (Sustainable Version)
    let parsedColorVariants = colorVariants;
    if (typeof colorVariants === 'string') {
      try {
        parsedColorVariants = JSON.parse(colorVariants);
      } catch (e) {
        parsedColorVariants = [];
      }
    }

    if (Array.isArray(parsedColorVariants)) {
      for (const [vIndex, cv] of parsedColorVariants.entries()) {
        const variantImages = files
          ?.filter(f => f.fieldname === `variantImages_${vIndex}`)
          .map(f => `${appUrl}/uploads/${f.filename}`) || [];

        const colorVariant = await this.productColorVariantRepository.save(
          this.productColorVariantRepository.create({
            productId: savedProduct.id,
            color: cv.color,
            images: variantImages,
          })
        );

        if (Array.isArray(cv.stocks)) {
          const stockEntities = cv.stocks.map((s: any) =>
            this.productStockRepository.create({
              productId: savedProduct.id,
              colorVariantId: colorVariant.id,
              size: s.size,
              stock: Number(s.stock) || 0,
            })
          );
          await this.productStockRepository.save(stockEntities);
        }
      }
    }

    const fullProduct = await this.findOne(savedProduct.id);
    await this.searchService.indexProduct(fullProduct);
    return fullProduct;
  }

  async findAll(query: any = {}) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;

    let products: Product[];
    let total: number;
    let categories: any[] = [];

    if (query.search) {
      const searchResults = await this.searchService.search(query.search);
      const productIds = searchResults
        .filter((r) => r.type === 'product')
        .map((p) => p.id);

      categories = searchResults.filter((r) => r.type === 'category');

      let fetchedProducts: Product[] = [];
      if (productIds.length > 0) {
        const fetchQb = this.productsRepository
          .createQueryBuilder('product')
          .whereInIds(productIds)
          .leftJoinAndSelect('product.category', 'category')
          .leftJoinAndSelect('product.brand', 'brand')
          .leftJoinAndSelect('product.discount', 'discount')
          .leftJoinAndSelect('product.priceHistory', 'priceHistory')
          .leftJoinAndSelect('product.colorVariants', 'colorVariants')
          .leftJoinAndSelect('colorVariants.stocks', 'stocks')
          .andWhere('product.isDeleted = :isDeleted', { isDeleted: false });

        if (query.minPrice) {
          fetchQb.andWhere('product.price >= :minPrice', {
            minPrice: query.minPrice,
          });
        }
        if (query.maxPrice) {
          fetchQb.andWhere('product.price <= :maxPrice', {
            maxPrice: query.maxPrice,
          });
        }
        if (query.brand) {
          const brands = Array.isArray(query.brand)
            ? query.brand
            : query.brand.split(',').map((b: string) => b.trim());
          fetchQb.andWhere(`brand.name IN (:...brands)`, {
            brands,
          });
        }
        if (query.color) {
          const colors = Array.isArray(query.color)
            ? query.color
            : query.color.split(',').map((c: string) => c.trim());
          fetchQb.andWhere(
            `(product.variants ->> 'color' IN (:...colors) OR colorVariants.color IN (:...colors))`,
            { colors },
          );
        }
        if (query.size) {
          const sizes = Array.isArray(query.size)
            ? query.size
            : query.size.split(',').map((s: string) => s.trim());
          fetchQb.andWhere(
            `(product.variants ->> 'size' IN (:...sizes) OR stocks.size IN (:...sizes))`,
            { sizes },
          );
        }
        if (query.gender) {
          const genders = Array.isArray(query.gender)
            ? query.gender
            : query.gender.split(',').map((g: string) => g.trim());
          fetchQb.andWhere(`product.gender IN (:...genders)`, { genders });
        }
        if (query.listingType) {
          const listingTypes = Array.isArray(query.listingType)
            ? query.listingType
            : (query.listingType as string).split(',').map(v => v.trim());
          fetchQb.andWhere('product.listingType IN (:...listingTypes)', { listingTypes });
        }

        // Handle dynamic variants in search
        const knownKeys = ['page', 'limit', 'search', 'minPrice', 'maxPrice', 'categoryId', 'sort', 'brand', 'color', 'size', 'gender', 'listingType'];
        Object.entries(query).forEach(([key, value]) => {
          if (!knownKeys.includes(key) && value) {
            const values = Array.isArray(value) ? value : (value as string).split(',').map(v => v.trim());
            if (values.length > 0) {
              fetchQb.andWhere(`product.variants ->> :key_${key} IN (:...val_${key})`, {
                [`key_${key}`]: key,
                [`val_${key}`]: values
              });
            }
          }
        });

        fetchedProducts = await fetchQb.getMany();
      }

      const productMap = new Map(fetchedProducts.map((p) => [p.id, p]));

      // Build ordered product list from ES relevance
      const orderedProducts: Product[] = [];
      for (const result of searchResults) {
        if (result.type === 'product') {
          const p = productMap.get(result.id);
          if (p) orderedProducts.push(p);
        }
      }

      total = orderedProducts.length;
      products = orderedProducts.slice(skip, skip + limit);
    } else {
      const qb = this.productsRepository.createQueryBuilder('product');

      qb.leftJoinAndSelect('product.category', 'category');
      qb.leftJoinAndSelect('product.brand', 'brand');
      qb.leftJoinAndSelect('product.colorVariants', 'colorVariants');
      qb.leftJoinAndSelect('colorVariants.stocks', 'stocks');
      qb.leftJoinAndSelect('product.discount', 'discount');
      qb.leftJoinAndSelect('product.priceHistory', 'priceHistory');
      qb.andWhere('product.isDeleted = :isDeleted', { isDeleted: false });

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
        qb.andWhere(`brand.name IN (:...brands)`, { brands });
      }

      if (query.color) {
        const colors = Array.isArray(query.color)
          ? query.color
          : query.color.split(',').map((c: string) => c.trim());
        qb.andWhere(
          `(product.variants ->> 'color' IN (:...colors) OR colorVariants.color IN (:...colors))`,
          { colors },
        );
      }

      if (query.size) {
        const sizes = Array.isArray(query.size)
          ? query.size
          : query.size.split(',').map((s: string) => s.trim());
        qb.andWhere(
          `(product.variants ->> 'size' IN (:...sizes) OR stocks.size IN (:...sizes))`,
          { sizes },
        );
      }

      if (query.gender) {
        const genders = Array.isArray(query.gender)
          ? query.gender
          : query.gender.split(',').map((g: string) => g.trim());
        qb.andWhere(`product.gender IN (:...genders)`, { genders });
      }

      if (query.listingType) {
        const listingTypes = Array.isArray(query.listingType)
          ? query.listingType
          : (query.listingType as string).split(',').map(v => v.trim());
        qb.andWhere('product.listingType IN (:...listingTypes)', { listingTypes });
      }

      // Handle dynamic variants
      const knownKeys = ['page', 'limit', 'search', 'minPrice', 'maxPrice', 'categoryId', 'sort', 'brand', 'color', 'size', 'gender', 'listingType'];
      Object.entries(query).forEach(([key, value]) => {
        if (!knownKeys.includes(key) && value) {
          const values = Array.isArray(value) ? value : (value as string).split(',').map(v => v.trim());
          if (values.length > 0) {
            qb.andWhere(`product.variants ->> :key_${key} IN (:...val_${key})`, {
              [`key_${key}`]: key,
              [`val_${key}`]: values
            });
          }
        }
      });

      if (query.sort === 'popular') {
        qb.orderBy('product.id', 'DESC');
      } else {
        qb.orderBy('product.createdAt', 'DESC');
      }

      total = await qb.getCount();
      qb.skip(skip).take(limit);
      products = await qb.getMany();
    }

    const mappedProducts = products.map((product) => this.mapProduct(product));

    const totalPages = Math.ceil(total / limit);

    return {
      data: [...categories, ...mappedProducts],
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async getFilters(query: any = {}) {
    let products: Product[] = [];

    if (query.search) {
      const searchResults = await this.searchService.search(query.search);
      const productIds = searchResults
        .filter((r) => r.type === 'product')
        .map((p) => p.id);

      if (productIds.length > 0) {
        const qb = this.productsRepository
          .createQueryBuilder('product')
          .whereInIds(productIds)
          .leftJoinAndSelect('product.stocks', 'stocks')
          .leftJoinAndSelect('product.colorVariants', 'colorVariants')
          .leftJoinAndSelect('product.brand', 'brand')
          .andWhere('product.isDeleted = :isDeleted', { isDeleted: false });

        if (query.listingType) {
          const listingTypes = Array.isArray(query.listingType) ? query.listingType : query.listingType.split(',').map(v => v.trim());
          qb.andWhere('product.listingType IN (:...listingTypes)', { listingTypes });
        }
        if (query.brand) {
          const brands = Array.isArray(query.brand) ? query.brand : query.brand.split(',').map(b => b.trim());
          qb.andWhere('brand.name IN (:...brands)', { brands });
        }
        if (query.color) {
          const colors = Array.isArray(query.color) ? query.color : query.color.split(',').map(c => c.trim());
          qb.andWhere('(product.variants ->> \'color\' IN (:...colors) OR colorVariants.color IN (:...colors))', { colors });
        }
        if (query.size) {
          const sizes = Array.isArray(query.size) ? query.size : query.size.split(',').map(s => s.trim());
          qb.andWhere('(product.variants ->> \'size\' IN (:...sizes) OR stocks.size IN (:...sizes))', { sizes });
        }
        if (query.gender) {
          const genders = Array.isArray(query.gender) ? query.gender : query.gender.split(',').map(g => g.trim());
          qb.andWhere('product.gender IN (:...genders)', { genders });
        }

        // Dynamic variants narrowing
        const knownKeys = ['page', 'limit', 'search', 'minPrice', 'maxPrice', 'categoryId', 'sort', 'brand', 'color', 'size', 'gender', 'listingType'];
        Object.entries(query).forEach(([key, value]) => {
          if (!knownKeys.includes(key) && value) {
            const values = Array.isArray(value) ? value : (value as string).split(',').map(v => v.trim());
            if (values.length > 0) {
              qb.andWhere(`product.variants ->> :key_${key} IN (:...val_${key})`, {
                [`key_${key}`]: key,
                [`val_${key}`]: values
              });
            }
          }
        });

        products = await qb.getMany();
      }
    } else {
      const qb = this.productsRepository.createQueryBuilder('product');
      qb.leftJoinAndSelect('product.stocks', 'stocks');
      qb.leftJoinAndSelect('product.colorVariants', 'colorVariants');
      qb.leftJoinAndSelect('product.brand', 'brand');
      qb.andWhere('product.isDeleted = :isDeleted', { isDeleted: false });

      if (query.categoryId) {
        qb.leftJoin('product.category', 'category');
        qb.andWhere('category.id = :categoryId', {
          categoryId: query.categoryId,
        });
      }

      if (query.listingType) {
        const listingTypes = Array.isArray(query.listingType)
          ? query.listingType
          : (query.listingType as string).split(',').map(v => v.trim());
        qb.andWhere('product.listingType IN (:...listingTypes)', { listingTypes });
      }

      if (query.brand) {
        const brands = Array.isArray(query.brand) ? query.brand : (query.brand as string).split(',').map(b => b.trim());
        qb.andWhere('brand.name IN (:...brands)', { brands });
      }

      if (query.color) {
        const colors = Array.isArray(query.color) ? query.color : (query.color as string).split(',').map(c => c.trim());
        qb.andWhere('(product.variants ->> \'color\' IN (:...colors) OR colorVariants.color IN (:...colors))', { colors });
      }

      if (query.size) {
        const sizes = Array.isArray(query.size) ? query.size : (query.size as string).split(',').map(s => s.trim());
        qb.andWhere('(product.variants ->> \'size\' IN (:...sizes) OR stocks.size IN (:...sizes))', { sizes });
      }

      if (query.gender) {
        const genders = Array.isArray(query.gender) ? query.gender : (query.gender as string).split(',').map(g => g.trim());
        qb.andWhere('product.gender IN (:...genders)', { genders });
      }

      // Handle dynamic variants for narrowing
      const knownKeys = ['page', 'limit', 'search', 'minPrice', 'maxPrice', 'categoryId', 'sort', 'brand', 'color', 'size', 'gender', 'listingType'];
      Object.entries(query).forEach(([key, value]) => {
        if (!knownKeys.includes(key) && value) {
          const values = Array.isArray(value) ? value : (value as string).split(',').map(v => v.trim());
          if (values.length > 0) {
            qb.andWhere(`product.variants ->> :key_${key} IN (:...val_${key})`, {
              [`key_${key}`]: key,
              [`val_${key}`]: values
            });
          }
        }
      });

      products = await qb.getMany();
    }

    if (!products || products.length === 0) {
      return {
        filters: {},
        priceRange: { min: 0, max: 0 },
      };
    }

    const dynamicFilters: Record<string, any[]> = {};

    products.forEach((product) => {
      // Extract Brand
      if (product.brand && product.brand.name) {
        if (!dynamicFilters['brand']) dynamicFilters['brand'] = [];
        dynamicFilters['brand'].push(product.brand.name);
      }

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

      // Extract from ProductColorVariant
      if (product.colorVariants && Array.isArray(product.colorVariants)) {
        product.colorVariants.forEach((cv) => {
          if (cv.color) {
            if (!dynamicFilters['color']) dynamicFilters['color'] = [];
            dynamicFilters['color'].push(cv.color);
          }
        });
      }

      // Extract from ProductStock (Trendyol model)
      if (product.stocks && Array.isArray(product.stocks)) {
        product.stocks.forEach((stock) => {
          if (stock.size) {
            if (!dynamicFilters['size']) dynamicFilters['size'] = [];
            dynamicFilters['size'].push(stock.size);
          }
        });
      }

      if (product.gender) {
        if (!dynamicFilters['gender']) dynamicFilters['gender'] = [];
        dynamicFilters['gender'].push(product.gender);
      }

      if (product.listingType) {
        if (!dynamicFilters['listingType']) dynamicFilters['listingType'] = [];
        dynamicFilters['listingType'].push(product.listingType);
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

    const prices = products
      .map((p) => Number(p.price))
      .filter((p) => !isNaN(p));
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

  async findNewArrivals(limit: number = 8) {
    const products = await this.productsRepository.find({
      where: { isDeleted: false },
      relations: ['category', 'brand', 'discount', 'priceHistory', 'colorVariants', 'colorVariants.stocks'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return products.map((product) => this.mapProduct(product));
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id, isDeleted: false },
      relations: [
        'category',
        'brand',
        'priceHistory',
        'colorVariants',
        'colorVariants.stocks',
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

    return this.mapProduct(product);
  }

  private mapProduct(product: Product) {
    const colorVariants = product.colorVariants?.map(cv => ({
      ...cv,
      images: Array.isArray(cv.images) ? cv.images.map(img => ensureFullUrl(img)) : [],
      stocks: cv.stocks?.map(s => ({
        ...s,
      }))
    })) || [];

    // Flat stocks for some frontend parts that might still expect it
    const allStocks = colorVariants.flatMap(cv =>
      (cv.stocks || []).map(s => ({
        ...s,
        color: cv.color,
        images: cv.images
      }))
    );

    return {
      ...product,
      colorVariants,
      banner: ensureFullUrl(product.banner),
      images: Array.isArray(product.images)
        ? (product.images
          .map((img) => ensureFullUrl(img))
          .filter(Boolean) as string[])
        : product.images,
      stocks: allStocks,
    } as any;
  }

  async update(
    id: number,
    updateProductDto: any,
    files?: Express.Multer.File[],
  ) {
    const {
      categoryId,
      brandId,
      variants,
      tags,
      colorVariants,
      existingImages,
      existingBanner,
      ...productData
    } = updateProductDto;

    const queryRunner = this.productsRepository.metadata.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOne(Product, {
        where: { id },
        relations: ['stocks'],
      });

      if (!product) {
        throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
      }

      const appUrl = process.env.APP_URL || 'http://localhost:4444';

      let bannerUrl = product.banner;
      const bannerFile = files?.find(f => f.fieldname === 'banner');
      if (bannerFile) {
        bannerUrl = `${appUrl}/uploads/${bannerFile.filename}`;
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

      const additionalImages = files?.filter(f => f.fieldname === 'images') || [];
      additionalImages.forEach((file) => {
        finalImages.push(`${appUrl}/uploads/${file.filename}`);
      });

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
      // Handle Color-based Variants & Stocks (Sustainable Version)
      let parsedColorVariants = colorVariants;
      if (typeof colorVariants === 'string') {
        try {
          parsedColorVariants = JSON.parse(colorVariants);
        } catch (e) {
          parsedColorVariants = [];
        }
      }

      if (Array.isArray(parsedColorVariants)) {
        // Clear existing variants and stocks
        await queryRunner.manager.delete(ProductStock, { productId: product.id });
        await queryRunner.manager.delete(ProductColorVariant, { productId: product.id });

        for (const [vIndex, cv] of parsedColorVariants.entries()) {
          const variantImages = files
            ?.filter(f => f.fieldname === `variantImages_${vIndex}`)
            .map(f => `${appUrl}/uploads/${f.filename}`) || [];

          const existingVariantImages = Array.isArray(cv.images) ? cv.images : [];
          const combinedImages = [...existingVariantImages, ...variantImages];

          const colorVariant = await queryRunner.manager.save(
            queryRunner.manager.create(ProductColorVariant, {
              productId: product.id,
              color: cv.color,
              images: combinedImages,
            })
          );

          if (Array.isArray(cv.stocks)) {
            const stockEntities = cv.stocks.map((s: any) =>
              queryRunner.manager.create(ProductStock, {
                productId: product.id,
                colorVariantId: colorVariant.id,
                size: s.size,
                stock: Number(s.stock) || 0,
              })
            );
            await queryRunner.manager.save(ProductStock, stockEntities);
          }
        }
      }

      delete (product as any).stocks;
      delete (product as any).colorVariants;

      if (categoryId && !isNaN(Number(categoryId)) && Number(categoryId) > 0) {
        product.category = { id: Number(categoryId) } as any;
      }
      if (brandId) {
        product.brand = { id: Number(brandId) } as any;
      }

      let finalBarcode = productData.barcode || product.barcode;
      if (!finalBarcode || finalBarcode.trim() === '') {
        finalBarcode = await this.generateUniqueBarcode();
      }

      this.productsRepository.merge(product, {
        ...productData,
        barcode: finalBarcode,
        banner: bannerUrl,
        images: finalImages,
        variants: parsedVariants,
        tags: parsedTags,
        price: productData.price ? Number(productData.price) : product.price,
      } as any);

      const savedProduct = await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      // Refresh product with relations for return and indexing
      const fullProduct = await this.findOne(savedProduct.id);
      await this.searchService.indexProduct(fullProduct);
      return fullProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        if (error.detail?.includes('sku')) {
          throw new ConflictException('Bu SKU (Məhsul Kodu) artıq istifadə olunub.');
        }
        if (error.detail?.includes('guid1c')) {
          throw new ConflictException('Bu GUID artıq bazada mövcuddur.');
        }
        throw new ConflictException(
          'Bu məlumat bazada təkrarlandığı üçün (Duplicate) qəbul edilmədi.',
        );
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new NotFoundException("Məhsul tapılmadı");

    await this.productsRepository.update(id, { isDeleted: true });
    await this.searchService.removeProduct(id);
    return product;
  }


  async findSimilar(id: number, limit: number = 4) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
    }

    const categoryName = product.category?.name || 'Uncategorized';
    const tags = product.tags || [];

    const similarProducts = await this.searchService.findSimilar(
      id,
      categoryName,
      tags,
      limit,
    );

    const ids = similarProducts.map((p: any) => p.id);
    if (ids.length === 0) return [];

    const fullProducts = await this.productsRepository.find({
      where: { id: In(ids), isDeleted: false },
      relations: [
        'category',
        'brand',
        'discount',
        'priceHistory',
        'colorVariants',
        'colorVariants.stocks',
      ],
    });

    return fullProducts.map((product) => this.mapProduct(product));
  }

  async syncSearchIndex() {
    const products = await this.productsRepository.find({
      where: { isDeleted: false },
      relations: ['category', 'brand', 'discount', 'stocks'],
    });

    const chunkSize = 100;
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize);
      await this.searchService.indexProducts(chunk as any);
    }

    return { count: products.length, message: 'Products indexed successfully' };
  }
}
