import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CartsService', () => {
  let service: CartsService;
  let mockCartRepository: any;
  let mockCartItemRepository: any;

  beforeEach(async () => {
    mockCartRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockCartItemRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        { provide: getRepositoryToken(Cart), useValue: mockCartRepository },
        { provide: getRepositoryToken(CartItem), useValue: mockCartItemRepository },
      ],
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOrCreateCart', () => {
    it('should return existing cart', async () => {
      const existingCart = { id: 1, user: { id: 1 }, items: [] };
      mockCartRepository.findOne.mockResolvedValue(existingCart);

      const result = await service.findOrCreateCart(1);
      expect(result).toEqual(existingCart);
    });

    it('should create new cart if not exists', async () => {
      mockCartRepository.findOne.mockResolvedValue(null);
      const newCart = { id: 2, user: { id: 1 }, items: [] };
      mockCartRepository.create.mockReturnValue(newCart);
      mockCartRepository.save.mockResolvedValue(newCart);

      const result = await service.findOrCreateCart(1);
      expect(mockCartRepository.create).toHaveBeenCalled();
      expect(result).toEqual(newCart);
    });
  });

  describe('addToCart', () => {
    it('should add new item if not in cart', async () => {
      const cart = { id: 1, items: [] };
      mockCartRepository.findOne.mockResolvedValue(cart);
      mockCartItemRepository.create.mockReturnValue({ id: 10 });

      const result = await service.addToCart(1, 101, 1);

      expect(mockCartItemRepository.create).toHaveBeenCalled();
      expect(mockCartItemRepository.save).toHaveBeenCalled();
    });

    it('should increase quantity if item already in cart', async () => {
      const cart = { id: 1, items: [{ id: 10, product: { id: 101 }, quantity: 1, variants: undefined }] };
      mockCartRepository.findOne.mockResolvedValue(cart);

      const result = await service.addToCart(1, 101, 2);

      expect(cart.items[0].quantity).toBe(3);
      expect(mockCartItemRepository.save).toHaveBeenCalled();
    });
  });

  describe('removeItem', () => {
    it('should remove item if exists', async () => {
      mockCartRepository.findOne.mockResolvedValue({ id: 1 });
      mockCartItemRepository.findOne.mockResolvedValue({ id: 10 });

      await service.removeItem(1, 10);
      expect(mockCartItemRepository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException if item not found', async () => {
      mockCartRepository.findOne.mockResolvedValue({ id: 1 });
      mockCartItemRepository.findOne.mockResolvedValue(null);

      await expect(service.removeItem(1, 10)).rejects.toThrow(NotFoundException);
    });
  });
});
