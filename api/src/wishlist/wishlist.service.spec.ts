import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { Wishlist } from './entities/wishlist.entity';
import { Product } from '../products/entities/product.entity';
import { CartsService } from '../carts/carts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('WishlistService', () => {
  let service: WishlistService;
  let mockWishlistRepository: any;
  let mockProductRepository: any;
  let mockCartsService: any;

  beforeEach(async () => {
    mockWishlistRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      delete: jest.fn(),
    };

    mockProductRepository = {
      findOne: jest.fn(),
    };

    mockCartsService = {
      addToCart: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: getRepositoryToken(Wishlist),
          useValue: mockWishlistRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        { provide: CartsService, useValue: mockCartsService },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should add product to wishlist', async () => {
      mockProductRepository.findOne.mockResolvedValue({ id: 1 });
      mockWishlistRepository.findOne.mockResolvedValue(null);
      mockWishlistRepository.create.mockReturnValue({ id: 10 });
      mockWishlistRepository.save.mockResolvedValue({ id: 10 });

      const result = await service.add(1, 1);
      expect(mockWishlistRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 10 });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);
      await expect(service.add(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if already in wishlist', async () => {
      mockProductRepository.findOne.mockResolvedValue({ id: 1 });
      mockWishlistRepository.findOne.mockResolvedValue({ id: 5 });
      await expect(service.add(1, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('moveToCart', () => {
    it('should move item from wishlist to cart', async () => {
      const wishlistItem = { id: 10, product: { id: 1 } };
      mockWishlistRepository.findOne.mockResolvedValue(wishlistItem);
      mockCartsService.addToCart.mockResolvedValue({});
      mockWishlistRepository.remove.mockResolvedValue({});

      const result = await service.moveToCart(1, 1);
      expect(mockCartsService.addToCart).toHaveBeenCalledWith(1, 1, 1);
      expect(mockWishlistRepository.remove).toHaveBeenCalledWith(wishlistItem);
      expect(result.message).toBe('Məhsul səbətə əlavə edildi');
    });

    it('should throw NotFoundException if item not in wishlist', async () => {
      mockWishlistRepository.findOne.mockResolvedValue(null);
      await expect(service.moveToCart(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
