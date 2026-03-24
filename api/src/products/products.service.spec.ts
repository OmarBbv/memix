import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { PriceHistory } from './entities/price-history.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../common/constants/error-messages';
import { SearchService } from '../search/search.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductsRepository: any;
  let mockPriceHistoryRepository: any;
  let mockSearchService: any;
  let mockQueryBuilder: any;

  beforeEach(async () => {
    // Mock Query Builder
    mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      whereInIds: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    // Mock Product Repository
    mockProductsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    // Mock Price History Repository
    mockPriceHistoryRepository = {
      save: jest.fn(),
    };

    // Mock Search Service
    mockSearchService = {
      indexProduct: jest.fn(),
      search: jest.fn(),
      removeProduct: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
        {
          provide: getRepositoryToken(PriceHistory),
          useValue: mockPriceHistoryRepository,
        },
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product and index it in search', async () => {
      const createProductDto = {
        name: 'Test Product',
        price: 100,
        categoryId: 1,
      } as any;
      const expectedProduct = { id: 1, ...createProductDto };
      mockProductsRepository.create.mockReturnValue(expectedProduct);
      mockProductsRepository.save.mockResolvedValue(expectedProduct);

      const result = await service.create(createProductDto);

      expect(mockProductsRepository.create).toHaveBeenCalled();
      expect(mockProductsRepository.save).toHaveBeenCalled();
      expect(mockSearchService.indexProduct).toHaveBeenCalledWith(
        expectedProduct,
      );

      // Service adds processed banner and images fields
      expect(result).toEqual({
        ...expectedProduct,
        banner: null,
        images: undefined,
      });
    });
  });

  describe('findAll', () => {
    it('should return all products without filters', async () => {
      await service.findAll({});
      expect(mockProductsRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should use search service when search query is provided', async () => {
      const searchResults = [{ id: 1 }, { id: 2 }];
      mockSearchService.search.mockResolvedValue(searchResults);

      await service.findAll({ search: 'test' });

      expect(mockSearchService.search).toHaveBeenCalledWith('test');
      expect(mockProductsRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.whereInIds).toHaveBeenCalledWith([1, 2]);
    });

    it('should apply category filter', async () => {
      await service.findAll({ categoryId: 1 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'category.id = :categoryId',
        { categoryId: 1 },
      );
    });

    it('should apply price filter', async () => {
      await service.findAll({ minPrice: 10, maxPrice: 100 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'product.price >= :minPrice',
        { minPrice: 10 },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'product.price <= :maxPrice',
        { maxPrice: 100 },
      );
    });

    it('should apply brand filter', async () => {
      await service.findAll({ brand: 'Nike' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        `product.variants ->> 'brand' = :brand`,
        { brand: 'Nike' },
      );
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = { id: 1, name: 'Test' };
      mockProductsRepository.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);

      // Service adds processed banner and images fields
      expect(result).toEqual({
        ...product,
        banner: null,
        images: undefined,
      });
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['category', 'discount', 'priceHistory'],
        order: { priceHistory: { changedAt: 'DESC' } },
      });
    });

    it('should throw NotFoundException if not found', async () => {
      mockProductsRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update a product and re-index it', async () => {
      const existingProduct = { id: 1, name: 'Old', price: 100 };
      const updateDto = { name: 'New' };
      const updatedProduct = { ...existingProduct, ...updateDto };

      mockProductsRepository.findOne.mockResolvedValue(existingProduct);
      mockProductsRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateDto as any);
      expect(mockProductsRepository.merge).toHaveBeenCalled();
      expect(mockProductsRepository.save).toHaveBeenCalled();
      expect(mockSearchService.indexProduct).toHaveBeenCalledWith(
        updatedProduct,
      );
      expect(result.name).toEqual('New');
    });

    // POSITIVE TEST: Price History
    it('should save price history when price changes significantly', async () => {
      const existingProduct = { id: 1, name: 'Phone', price: 1000 };
      const updateDto = { price: 900 }; // Price changed from 1000 to 900
      const updatedProduct = { ...existingProduct, ...updateDto };

      mockProductsRepository.findOne.mockResolvedValue(existingProduct);
      mockProductsRepository.save.mockResolvedValue(updatedProduct);

      await service.update(1, updateDto as any);

      // Verify price history was saved
      expect(mockPriceHistoryRepository.save).toHaveBeenCalledWith({
        price: 1000, // Should save the OLD price
        product: { id: 1 },
      });
      // Verify product update and re-index happened
      expect(mockProductsRepository.save).toHaveBeenCalled();
      expect(mockSearchService.indexProduct).toHaveBeenCalledWith(
        updatedProduct,
      );
    });

    // NEGATIVE TEST: No Price History on Same Price
    it('should NOT save price history when price remains the same', async () => {
      const existingProduct = { id: 1, name: 'Phone', price: 1000 };
      const updateDto = { price: 1000 }; // Price unchanged
      const updatedProduct = { ...existingProduct, ...updateDto };

      mockProductsRepository.findOne.mockResolvedValue(existingProduct);
      mockProductsRepository.save.mockResolvedValue(updatedProduct);

      await service.update(1, updateDto as any);

      expect(mockPriceHistoryRepository.save).not.toHaveBeenCalled();
      expect(mockProductsRepository.save).toHaveBeenCalled();
    });

    // NEGATIVE TEST: No Price History on Negligible Change
    it('should NOT save price history when price change is negligible', async () => {
      const existingProduct = { id: 1, name: 'Phone', price: 1000 };
      const updateDto = { price: 1000.005 }; // Tiny change
      const updatedProduct = { ...existingProduct, ...updateDto };

      mockProductsRepository.findOne.mockResolvedValue(existingProduct);
      mockProductsRepository.save.mockResolvedValue(updatedProduct);

      await service.update(1, updateDto as any);

      expect(mockPriceHistoryRepository.save).not.toHaveBeenCalled();
      expect(mockProductsRepository.save).toHaveBeenCalled();
    });

    // NEGATIVE TEST: Product Not Found
    it('should throw NotFoundException if product to update is not found', async () => {
      mockProductsRepository.findOne.mockResolvedValue(null);
      await expect(service.update(999, { name: 'New' } as any)).rejects.toThrow(
        new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND),
      );
      expect(mockPriceHistoryRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a product and delete from search index', async () => {
      const product = { id: 1 };
      mockProductsRepository.findOne.mockResolvedValue(product);
      mockProductsRepository.remove.mockResolvedValue(product);

      await service.remove(1);
      expect(mockProductsRepository.remove).toHaveBeenCalled();
      expect(mockSearchService.removeProduct).toHaveBeenCalledWith(1);
    });
  });
});
