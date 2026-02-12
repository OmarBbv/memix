import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../common/constants/error-messages';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductsRepository: any;
  let mockQueryBuilder: any;

  beforeEach(async () => {
    // Mock Query Builder
    mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto = { name: 'Test Product', price: 100, categoryId: 1 } as any;
      const expectedProduct = { id: 1, ...createProductDto };
      mockProductsRepository.create.mockReturnValue(expectedProduct);
      mockProductsRepository.save.mockResolvedValue(expectedProduct);

      const result = await service.create(createProductDto);

      expect(mockProductsRepository.create).toHaveBeenCalled();
      expect(mockProductsRepository.save).toHaveBeenCalled();
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
    it('should update a product', async () => {
      const existingProduct = { id: 1, name: 'Old' };
      const updateDto = { name: 'New' };
      mockProductsRepository.findOne.mockResolvedValue(existingProduct);
      mockProductsRepository.save.mockResolvedValue({ ...existingProduct, ...updateDto });

      const result = await service.update(1, updateDto as any);
      expect(mockProductsRepository.merge).toHaveBeenCalled();
      expect(mockProductsRepository.save).toHaveBeenCalled();
      expect(result.name).toEqual('New');
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const product = { id: 1 };
      mockProductsRepository.findOne.mockResolvedValue(product);
      mockProductsRepository.remove.mockResolvedValue(product);

      await service.remove(1);
      expect(mockProductsRepository.remove).toHaveBeenCalled();
    });
  });
});
