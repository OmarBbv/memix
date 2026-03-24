import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsService } from './campaigns.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Campaign, CampaignType } from './entities/campaign.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { NotFoundException } from '@nestjs/common';

describe('CampaignsService', () => {
  let service: CampaignsService;
  let mockCampaignRepository: any;
  let mockCouponRepository: any;

  beforeEach(async () => {
    mockCampaignRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    mockCouponRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockCampaignRepository,
        },
        { provide: getRepositoryToken(Coupon), useValue: mockCouponRepository },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Positive Tests', () => {
    it('1. create - should successfully create a campaign without coupon', async () => {
      const dto = { title: 'Test 1', type: CampaignType.DISCOUNT };
      mockCampaignRepository.create.mockReturnValue(dto);
      mockCampaignRepository.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto as any);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockCampaignRepository.create).toHaveBeenCalledWith(dto);
      expect(mockCampaignRepository.save).toHaveBeenCalled();
    });

    it('2. create - should successfully create a campaign with a valid coupon', async () => {
      const dto = { title: 'Test 2', type: CampaignType.DISCOUNT, couponId: 5 };
      mockCouponRepository.findOne.mockResolvedValue({
        id: 5,
        code: 'TESTCOUPON',
      });
      mockCampaignRepository.create.mockReturnValue({
        title: 'Test 2',
        type: CampaignType.DISCOUNT,
      });
      mockCampaignRepository.save.mockImplementation(async (entity) => ({
        id: 2,
        ...entity,
      }));

      const result = await service.create(dto as any);
      expect(result.coupon).toBeDefined();
      expect(result.coupon.id).toBe(5);
      expect(mockCouponRepository.findOne).toHaveBeenCalledWith({
        where: { id: 5 },
      });
    });

    it('3. findAll - should return all campaigns ordered', async () => {
      const campaigns = [{ id: 1 }, { id: 2 }];
      mockCampaignRepository.find.mockResolvedValue(campaigns);

      const result = await service.findAll();
      expect(result).toEqual(campaigns);
      expect(mockCampaignRepository.find).toHaveBeenCalledWith({
        relations: ['coupon'],
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    });

    it('4. findActive - should return active campaigns with no dates', async () => {
      const campaigns = [{ id: 1, isActive: true }];
      mockCampaignRepository.find.mockResolvedValue(campaigns);

      const result = await service.findActive();
      expect(result).toEqual(campaigns);
    });

    it('5. findActive - should return active campaigns where current date is between startDate and endDate', async () => {
      const now = new Date();
      const campaigns = [
        {
          id: 1,
          isActive: true,
          startDate: new Date(now.getTime() - 100000),
          endDate: new Date(now.getTime() + 100000),
        },
      ];
      mockCampaignRepository.find.mockResolvedValue(campaigns);

      const result = await service.findActive();
      expect(result.length).toBe(1);
    });

    it('6. findActive - should return active campaigns where startDate is in past, endDate is null', async () => {
      const now = new Date();
      const campaigns = [
        {
          id: 1,
          isActive: true,
          startDate: new Date(now.getTime() - 100000),
          endDate: null,
        },
      ];
      mockCampaignRepository.find.mockResolvedValue(campaigns);

      const result = await service.findActive();
      expect(result.length).toBe(1);
    });

    it('7. findActive - should return active campaigns where startDate is null, endDate is in future', async () => {
      const now = new Date();
      const campaigns = [
        {
          id: 1,
          isActive: true,
          startDate: null,
          endDate: new Date(now.getTime() + 100000),
        },
      ];
      mockCampaignRepository.find.mockResolvedValue(campaigns);

      const result = await service.findActive();
      expect(result.length).toBe(1);
    });

    it('8. findOne - should return campaign by id', async () => {
      const campaign = { id: 1 };
      mockCampaignRepository.findOne.mockResolvedValue(campaign);

      const result = await service.findOne(1);
      expect(result).toEqual(campaign);
    });

    it('9. update - should successfully update campaign fields', async () => {
      const campaign = { id: 1, title: 'Old Title' };
      mockCampaignRepository.findOne.mockResolvedValue(campaign);
      mockCampaignRepository.save.mockImplementation(async (entity) => entity);

      const result = await service.update(1, { title: 'New Title' } as any);
      expect(result.title).toBe('New Title');
    });

    it('10. update - should successfully link a new coupon to a campaign', async () => {
      const campaign = { id: 1, title: 'Test' };
      mockCampaignRepository.findOne.mockResolvedValue(campaign);
      mockCouponRepository.findOne.mockResolvedValue({ id: 10 });
      mockCampaignRepository.save.mockImplementation(async (entity) => entity);

      const result = await service.update(1, { couponId: 10 } as any);
      expect(result.coupon).toBeDefined();
      expect((result.coupon as any).id).toBe(10);
    });

    it('11. update - should successfully unlink a coupon (assign null) from a campaign', async () => {
      const campaign = { id: 1, title: 'Test', coupon: { id: 10 } };
      mockCampaignRepository.findOne.mockResolvedValue(campaign);
      mockCampaignRepository.save.mockImplementation(async (entity) => entity);

      const result = await service.update(1, { couponId: null } as any);
      expect(result.coupon).toBeNull();
    });

    it('12. remove - should delete a campaign', async () => {
      const campaign = { id: 1 };
      mockCampaignRepository.findOne.mockResolvedValue(campaign);
      mockCampaignRepository.remove.mockResolvedValue(campaign);

      const result = await service.remove(1);
      expect(result).toEqual(campaign);
      expect(mockCampaignRepository.remove).toHaveBeenCalledWith(campaign);
    });
  });

  describe('Negative Tests', () => {
    it('1. create - should throw NotFoundException if couponId is provided but coupon doesnt exist', async () => {
      mockCouponRepository.findOne.mockResolvedValue(null);
      await expect(
        service.create({
          title: 'Test',
          type: CampaignType.DISCOUNT,
          couponId: 999,
        } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('2. findActive - should not return campaigns with isActive: false (though repo filters them out, test filter logic)', async () => {
      // FindActive mock finds active ones from repo, but if a bug exists and repo returns inactive, filter should ignore?
      // Actually repo filters WHERE isActive: true.
      mockCampaignRepository.find.mockImplementation((params) => {
        if (params.where?.isActive) return [{ id: 1, isActive: true }];
        return [];
      });
      const result = await service.findActive();
      // Test ensures the repo call uses { isActive: true }
      expect(mockCampaignRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: true } }),
      );
    });

    it('3. findActive - should not return campaigns where endDate is in the past', async () => {
      const now = new Date();
      const campaigns = [
        {
          id: 1,
          isActive: true,
          endDate: new Date(now.getTime() - 100000),
        },
      ];
      mockCampaignRepository.find.mockResolvedValue(campaigns);

      const result = await service.findActive();
      expect(result.length).toBe(0);
    });

    it('4. findActive - should not return campaigns where startDate is in the future', async () => {
      const now = new Date();
      const campaigns = [
        {
          id: 1,
          isActive: true,
          startDate: new Date(now.getTime() + 100000),
        },
      ];
      mockCampaignRepository.find.mockResolvedValue(campaigns);

      const result = await service.findActive();
      expect(result.length).toBe(0);
    });

    it('5. findOne - should throw NotFoundException if campaign doesnt exist', async () => {
      mockCampaignRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('6. update - should throw NotFoundException if campaign to update doesnt exist', async () => {
      mockCampaignRepository.findOne.mockResolvedValue(null);
      await expect(
        service.update(999, { title: 'New' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('7. update - should throw NotFoundException if new couponId doesnt exist', async () => {
      mockCampaignRepository.findOne.mockResolvedValue({ id: 1 });
      mockCouponRepository.findOne.mockResolvedValue(null);
      await expect(service.update(1, { couponId: 999 } as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('8. remove - should throw NotFoundException if campaign to remove doesnt exist', async () => {
      mockCampaignRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
