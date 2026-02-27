import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsService } from './promotions.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CouponsService } from '../coupons/coupons.service';
import { DiscountsService } from '../discounts/discounts.service';

describe('PromotionsService', () => {
  let service: PromotionsService;
  let mockCampaignsService: any;
  let mockCouponsService: any;
  let mockDiscountsService: any;

  beforeEach(async () => {
    mockCampaignsService = {
      findActive: jest.fn(),
    };
    mockCouponsService = {
      findActive: jest.fn(),
    };
    mockDiscountsService = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionsService,
        { provide: CampaignsService, useValue: mockCampaignsService },
        { provide: CouponsService, useValue: mockCouponsService },
        { provide: DiscountsService, useValue: mockDiscountsService },
      ],
    }).compile();

    service = module.get<PromotionsService>(PromotionsService);
  });

  describe('Positive Tests', () => {
    it('1. getPromotionsPage - should return aggregate data successfully', async () => {
      mockCampaignsService.findActive.mockResolvedValue([{ id: 1 }]);
      mockCouponsService.findActive.mockResolvedValue([{ id: 2 }]);
      mockDiscountsService.findAll.mockResolvedValue([{ id: 3, isActive: true, product: { id: 10 } }]);

      const result = await service.getPromotionsPage();
      expect(result.campaigns.length).toBe(1);
      expect(result.coupons.length).toBe(1);
      expect(result.discountedProducts.length).toBe(1);
    });

    it('2. getPromotionsPage - should map discounted products correctly', async () => {
      mockCampaignsService.findActive.mockResolvedValue([]);
      mockCouponsService.findActive.mockResolvedValue([]);
      mockDiscountsService.findAll.mockResolvedValue([{
        id: 3,
        isActive: true,
        type: 'percentage',
        value: 10,
        product: { id: 10 }
      }]);

      const result = await service.getPromotionsPage();
      expect(result.discountedProducts[0]).toEqual({
        discount: { id: 3, type: 'percentage', value: 10 },
        product: { id: 10 }
      });
    });

    it('3. getPromotionsPage - should include discount without dates', async () => {
      mockCampaignsService.findActive.mockResolvedValue([]);
      mockCouponsService.findActive.mockResolvedValue([]);
      mockDiscountsService.findAll.mockResolvedValue([{ id: 3, isActive: true, product: {} }]);
      const result = await service.getPromotionsPage();
      expect(result.discountedProducts.length).toBe(1);
    });

    it('4. getPromotionsPage - should include discount with valid startDate (past) and endDate (future)', async () => {
      const now = new Date();
      mockCampaignsService.findActive.mockResolvedValue([]);
      mockCouponsService.findActive.mockResolvedValue([]);
      mockDiscountsService.findAll.mockResolvedValue([{
        id: 3,
        isActive: true,
        startDate: new Date(now.getTime() - 10000),
        endDate: new Date(now.getTime() + 10000),
        product: {}
      }]);
      const result = await service.getPromotionsPage();
      expect(result.discountedProducts.length).toBe(1);
    });
  });

  describe('Negative Tests', () => {
    it('1. getPromotionsPage - should filter out inactive discounts', async () => {
      mockCampaignsService.findActive.mockResolvedValue([]);
      mockCouponsService.findActive.mockResolvedValue([]);
      mockDiscountsService.findAll.mockResolvedValue([{ id: 3, isActive: false }]);

      const result = await service.getPromotionsPage();
      expect(result.discountedProducts.length).toBe(0);
    });

    it('2. getPromotionsPage - should filter out discount with past endDate', async () => {
      const now = new Date();
      mockCampaignsService.findActive.mockResolvedValue([]);
      mockCouponsService.findActive.mockResolvedValue([]);
      mockDiscountsService.findAll.mockResolvedValue([{
        id: 3,
        isActive: true,
        endDate: new Date(now.getTime() - 10000)
      }]);

      const result = await service.getPromotionsPage();
      expect(result.discountedProducts.length).toBe(0);
    });

    it('3. getPromotionsPage - should filter out discount with future startDate', async () => {
      const now = new Date();
      mockCampaignsService.findActive.mockResolvedValue([]);
      mockCouponsService.findActive.mockResolvedValue([]);
      mockDiscountsService.findAll.mockResolvedValue([{
        id: 3,
        isActive: true,
        startDate: new Date(now.getTime() + 10000)
      }]);

      const result = await service.getPromotionsPage();
      expect(result.discountedProducts.length).toBe(0);
    });

    it('4. getPromotionsPage - should bubble up error if any service fails', async () => {
      mockCampaignsService.findActive.mockRejectedValue(new Error('DB Error'));
      mockCouponsService.findActive.mockResolvedValue([]);
      mockDiscountsService.findAll.mockResolvedValue([]);

      await expect(service.getPromotionsPage()).rejects.toThrow('DB Error');
    });
  });
});
