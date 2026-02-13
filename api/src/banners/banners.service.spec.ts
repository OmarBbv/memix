import { Test, TestingModule } from '@nestjs/testing';
import { BannersService } from './banners.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Banner, BannerLocation } from './entities/banner.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockBannerRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue(Promise.resolve([])), // Default return for QueryBuilder mock
  })),
  merge: jest.fn(),
  remove: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('BannersService', () => {
  let service: BannersService;
  let repository: MockRepository<Banner>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BannersService,
        {
          provide: getRepositoryToken(Banner),
          useFactory: mockBannerRepository,
        },
      ],
    }).compile();

    service = module.get<BannersService>(BannersService);
    repository = module.get<MockRepository<Banner>>(getRepositoryToken(Banner));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new banner', async () => {
      const createBannerDto = {
        title: 'New Banner',
        imageUrl: 'image.jpg',
        location: BannerLocation.HOME_MAIN_SLIDER,
      };

      const expectedBanner = {
        id: 1,
        ...createBannerDto,
        isActive: true, // Assuming default true was not passed but handled by entity logic, though here logic is in our mock
      };

      repository.create.mockReturnValue(expectedBanner);
      repository.save.mockResolvedValue(expectedBanner);

      const result = await service.create(createBannerDto);
      expect(result).toEqual(expectedBanner);
      expect(repository.create).toHaveBeenCalledWith(createBannerDto);
      expect(repository.save).toHaveBeenCalledWith(expectedBanner);
    });
  });

  describe('findAll', () => {
    it('should return an array of banners', async () => {
      const banners = [{ id: 1, title: 'Banner 1' }];

      // Since findAll uses QueryBuilder, we need to mock the chain correctly
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(banners),
      };

      // Override the repository mock specifically for this test case if needed, or use the one from mockBannerRepository
      // Since mockBannerRepository already provides a mock for createQueryBuilder, we can just spy/mock implementation if needed.
      // But let's refine the repository mock setup above to be more flexible or assert on it here.

      (repository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await service.findAll();
      expect(result).toEqual(banners);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('banner');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('banner.isActive = :isActive', { isActive: true });
    });

    it('should filter by location if provided', async () => {
      const location = BannerLocation.HOME_MIDDLE;
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      (repository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      await service.findAll(location);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('banner.location = :location', { location });
    });
  });

  describe('findOne', () => {
    it('should return a banner by id', async () => {
      const banner = { id: 1, title: 'Test' };
      repository.findOneBy.mockResolvedValue(banner);

      const result = await service.findOne(1);
      expect(result).toEqual(banner);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if banner not found', async () => {
      repository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a banner', async () => {
      const existingBanner = { id: 1, title: 'Old Title' };
      const updateDto = { title: 'New Title' };
      // We expect merge to modify the object in place usually, so saving it returns the modified object
      const updatedBanner = { ...existingBanner, ...updateDto };

      repository.findOneBy.mockResolvedValue(existingBanner);
      // repository.merge implementation: (entity, dto) => Object.assign(entity, dto) roughly
      repository.merge.mockImplementation((entity, dto) => Object.assign(entity, dto));
      repository.save.mockResolvedValue(updatedBanner);

      const result = await service.update(1, updateDto);
      expect(result.title).toEqual('New Title');
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a banner', async () => {
      const banner = { id: 1 };
      repository.findOneBy.mockResolvedValue(banner);
      repository.remove.mockResolvedValue(banner);

      const result = await service.remove(1);
      expect(result).toEqual(banner);
      expect(repository.remove).toHaveBeenCalledWith(banner);
    });
  });
});
