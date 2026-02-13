import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../common/constants/error-messages';
import { SearchService } from '../search/search.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductsRepository: any;
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

    // Mock Repository
    mockProductsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
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
      const createProductDto = { name: 'Test Product', price: 100, categoryId: 1 } as any;
      const expectedProduct = { id: 1, ...createProductDto };
      mockProductsRepository.create.mockReturnValue(expectedProduct);
      mockProductsRepository.save.mockResolvedValue(expectedProduct);

      const result = await service.create(createProductDto);

      expect(mockProductsRepository.create).toHaveBeenCalled();
      expect(mockProductsRepository.save).toHaveBeenCalled();
      expect(mockSearchService.indexProduct).toHaveBeenCalledWith(expectedProduct);
      expect(result).toEqual(expectedProduct);
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
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('category.id = :categoryId', { categoryId: 1 });
    });

    it('should apply price filter', async () => {
      await service.findAll({ minPrice: 10, maxPrice: 100 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.price >= :minPrice', { minPrice: 10 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.price <= :maxPrice', { maxPrice: 100 });
    });

    it('should apply brand filter', async () => {
      await service.findAll({ brand: 'Nike' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(`product.variants ->> 'brand' = :brand`, { brand: 'Nike' });
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = { id: 1, name: 'Test' };
      mockProductsRepository.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if not found', async () => {
      mockProductsRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND));
    });
  });

  describe('update', () => {
    it('should update a product and re-index it', async () => {
      const existingProduct = { id: 1, name: 'Old' };
      const updateDto = { name: 'New' };
      const updatedProduct = { ...existingProduct, ...updateDto };

      mockProductsRepository.findOne.mockResolvedValue(existingProduct);
      mockProductsRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateDto as any);
      expect(mockProductsRepository.merge).toHaveBeenCalled();
      expect(mockProductsRepository.save).toHaveBeenCalled();
      expect(mockSearchService.indexProduct).toHaveBeenCalledWith(updatedProduct);
      expect(result.name).toEqual('New');
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
