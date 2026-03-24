import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Branch } from '../branches/entities/branch.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let mockOrderRepository: any;
  let mockUserRepository: any;
  let mockProductRepository: any;
  let mockBranchRepository: any;

  beforeEach(async () => {
    mockOrderRepository = {
      find: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockUserRepository = {
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockProductRepository = {
      find: jest.fn(),
    };

    mockBranchRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        { provide: getRepositoryToken(Branch), useValue: mockBranchRepository },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSalesStats', () => {
    it('should return sales statistics', async () => {
      const orders = [
        { totalPrice: 100, status: OrderStatus.DELIVERED },
        { totalPrice: 200, status: OrderStatus.DELIVERED },
      ];
      mockOrderRepository.find.mockResolvedValue(orders);

      const result = await service.getSalesStats();
      expect(result.totalSales).toBe(300);
      expect(result.totalOrders).toBe(2);
      expect(result.averageOrderValue).toBe(150);
    });
  });

  describe('getUserActivity', () => {
    it('should return user activity stats', async () => {
      mockUserRepository.count.mockResolvedValue(100);
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ count: '30' }),
      };
      mockUserRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getUserActivity();
      expect(result.totalUsers).toBe(100);
      expect(result.activeUsers).toBe(30);
      expect(result.inactiveUsers).toBe(70);
      expect(result.activityRate).toBe(30);
    });
  });

  describe('getBranchPerformance', () => {
    it('should return branch performance data', async () => {
      const branches = [
        {
          id: 1,
          name: 'Branch 1',
          address: 'Address 1',
          stocks: [{ stock: 10 }, { stock: 20 }],
        },
        {
          id: 2,
          name: 'Branch 2',
          address: 'Address 2',
          stocks: [{ stock: 15 }],
        },
      ];
      mockBranchRepository.find.mockResolvedValue(branches);

      const result = await service.getBranchPerformance();
      expect(result).toHaveLength(2);
      expect(result[0].totalStock).toBe(30);
      expect(result[1].totalStock).toBe(15);
    });
  });
});
