import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let mockReviewRepository: any;
  let mockProductRepository: any;

  beforeEach(async () => {
    mockReviewRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockProductRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: getRepositoryToken(Review), useValue: mockReviewRepository },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a review successfully', async () => {
      const createReviewDto = { productId: 1, rating: 5, comment: 'Great!' };
      mockProductRepository.findOne.mockResolvedValue({ id: 1 });
      mockReviewRepository.findOne.mockResolvedValue(null); // Əvvəlki rəy yoxdur
      mockReviewRepository.create.mockReturnValue({ id: 10 });
      mockReviewRepository.save.mockResolvedValue({ id: 10 });

      const result = await service.create(1, createReviewDto);
      expect(mockReviewRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 10 });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);
      await expect(
        service.create(1, { productId: 999, rating: 5 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user already reviewed', async () => {
      mockProductRepository.findOne.mockResolvedValue({ id: 1 });
      mockReviewRepository.findOne.mockResolvedValue({ id: 5 }); // Artıq rəy var
      await expect(
        service.create(1, { productId: 1, rating: 5 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('approve', () => {
    it('should approve a review', async () => {
      const review = { id: 1, isApproved: false };
      mockReviewRepository.findOne.mockResolvedValue(review);
      mockReviewRepository.save.mockResolvedValue({
        ...review,
        isApproved: true,
      });

      const result = await service.approve(1);
      expect(result.isApproved).toBe(true);
    });
  });

  describe('getAverageRating', () => {
    it('should return average rating', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ average: '4.5' }),
      };
      mockReviewRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getAverageRating(1);
      expect(result).toBe(4.5);
    });
  });
});
