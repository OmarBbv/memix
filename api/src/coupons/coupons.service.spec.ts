import { Test, TestingModule } from '@nestjs/testing';
import { CouponsService } from './coupons.service';
import { Coupon, DiscountType } from './entities/coupon.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CouponsService', () => {
  let service: CouponsService;
  let mockCouponRepository: any;

  beforeEach(async () => {
    mockCouponRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponsService,
        { provide: getRepositoryToken(Coupon), useValue: mockCouponRepository },
      ],
    }).compile();

    service = module.get<CouponsService>(CouponsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a coupon', async () => {
      const createDto = {
        code: 'SUMMER20',
        type: DiscountType.PERCENTAGE,
        value: 20,
      };
      mockCouponRepository.findOne.mockResolvedValue(null);
      mockCouponRepository.create.mockReturnValue({ id: 1, ...createDto });
      mockCouponRepository.save.mockResolvedValue({ id: 1, ...createDto });

      const result = await service.create(createDto as any);
      expect(result.code).toBe('SUMMER20');
    });

    it('should throw BadRequestException if code exists', async () => {
      mockCouponRepository.findOne.mockResolvedValue({ id: 1 });
      await expect(service.create({ code: 'EXIST' } as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validate', () => {
    it('should validate a valid coupon', async () => {
      const coupon = {
        id: 1,
        code: 'VALID',
        isActive: true,
        expiresAt: new Date(Date.now() + 100000),
        usageLimit: 10,
        usedCount: 5,
        minOrderAmount: 50,
      };
      mockCouponRepository.findOne.mockResolvedValue(coupon);

      const result = await service.validate('VALID', 100);
      expect(result).toEqual(coupon);
    });

    it('should throw NotFoundException if coupon not found', async () => {
      mockCouponRepository.findOne.mockResolvedValue(null);
      await expect(service.validate('INVALID', 100)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if expired', async () => {
      const coupon = {
        isActive: true,
        expiresAt: new Date(Date.now() - 100000),
      };
      mockCouponRepository.findOne.mockResolvedValue(coupon);
      await expect(service.validate('EXPIRED', 100)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate percentage discount', () => {
      const coupon = { type: DiscountType.PERCENTAGE, value: 20 } as Coupon;
      const discount = service.calculateDiscount(coupon, 100);
      expect(discount).toBe(20);
    });

    it('should calculate fixed discount', () => {
      const coupon = { type: DiscountType.FIXED, value: 15 } as Coupon;
      const discount = service.calculateDiscount(coupon, 100);
      expect(discount).toBe(15);
    });
  });
});
