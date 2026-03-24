import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { ProductStock } from '../branches/entities/product-stock.entity';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let mockOrderRepository: any;
  let mockOrderItemRepository: any;
  let mockCartRepository: any;
  let mockProductStockRepository: any;
  let mockDataSource: any;
  let mockQueryRunner: any;

  beforeEach(async () => {
    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
        delete: jest.fn(),
      },
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    mockOrderRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    mockOrderItemRepository = {
      create: jest.fn(),
    };

    mockCartRepository = {
      findOne: jest.fn(),
    };

    mockProductStockRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepository },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
        { provide: getRepositoryToken(Cart), useValue: mockCartRepository },
        {
          provide: getRepositoryToken(ProductStock),
          useValue: mockProductStockRepository,
        },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if cart is empty', async () => {
      mockCartRepository.findOne.mockResolvedValue(null);
      await expect(service.create(1, 'addr', '123', 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if stock is insufficient', async () => {
      const cart = {
        items: [{ product: { id: 101, name: 'P1' }, quantity: 5 }],
      };
      mockCartRepository.findOne.mockResolvedValue(cart);
      mockProductStockRepository.findOne.mockResolvedValue({ stock: 2 }); // Kifayət deyil

      await expect(service.create(1, 'addr', '123', 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create order successfully', async () => {
      const cart = {
        id: 10,
        items: [
          {
            product: { id: 101, price: 10, name: 'P1' },
            quantity: 2,
            variants: {},
          },
        ],
      };
      mockCartRepository.findOne.mockResolvedValue(cart);
      mockProductStockRepository.findOne.mockResolvedValue({ stock: 10 });
      mockOrderItemRepository.create.mockReturnValue({});
      mockOrderRepository.create.mockReturnValue({ id: 500 });

      const result = await service.create(1, 'addr', '123', 1);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });
});
