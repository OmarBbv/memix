import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ErrorMessages } from '../common/constants/error-messages';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let mockCategoriesRepository: any;

  beforeEach(async () => {
    // Mock Repository
    mockCategoriesRepository = {
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto = { name: 'Test Category' };
      const expectedCategory = { id: 1, name: 'Test Category', slug: 'test-category' };
      mockCategoriesRepository.findOneBy.mockResolvedValue(null);
      mockCategoriesRepository.create.mockReturnValue(expectedCategory);
      mockCategoriesRepository.save.mockResolvedValue(expectedCategory);

      const result = await service.create(createCategoryDto);
      expect(mockCategoriesRepository.create).toHaveBeenCalled();
      expect(mockCategoriesRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedCategory);
    });

    it('should throw ConflictException if category already exists', async () => {
      const createCategoryDto = { name: 'Test Category' };
      mockCategoriesRepository.findOneBy.mockResolvedValue({ id: 1 }); // Artıq mövcuddur

      await expect(service.create(createCategoryDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a category if found', async () => {
      const category = { id: 1, name: 'Test' };
      mockCategoriesRepository.findOneBy.mockResolvedValue(category);
      const result = await service.findOne(1);
      expect(result).toEqual(category);
    });

    it('should throw NotFoundException if not found', async () => {
      mockCategoriesRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(new NotFoundException(ErrorMessages.CATEGORY_NOT_FOUND));
    });
  });

  describe('getFilters', () => {
    it('should return filters for a category', async () => {
      const products = [
        { id: 1, price: 100, variants: { brand: 'Nike', color: 'Black', size: '42' } },
        { id: 2, price: 200, variants: { brand: 'Adidas', color: 'White', size: '43' } },
      ];
      const category = { id: 1, products };

      mockCategoriesRepository.findOne.mockResolvedValue(category);

      const result = await service.getFilters(1);

      expect(result.brands).toEqual(expect.arrayContaining(['Nike', 'Adidas']));
      expect(result.colors).toEqual(expect.arrayContaining(['Black', 'White']));
      expect(result.sizes).toEqual(expect.arrayContaining(['42', '43']));
      expect(result.priceRange).toEqual({ min: 100, max: 200 });
    });

    it('should return empty filters if no products exist', async () => {
      const category = { id: 1, products: [] };
      mockCategoriesRepository.findOne.mockResolvedValue(category);

      const result = await service.getFilters(1);
      expect(result.brands).toEqual([]);
      expect(result.priceRange).toEqual({ min: 0, max: 0 });
    });

    it('should throw NotFoundException if category not found for filters', async () => {
      mockCategoriesRepository.findOne.mockResolvedValue(null);
      await expect(service.getFilters(999)).rejects.toThrow(new NotFoundException(ErrorMessages.CATEGORY_NOT_FOUND));
    });
  });
});
