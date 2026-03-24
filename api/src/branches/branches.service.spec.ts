import { Test, TestingModule } from '@nestjs/testing';
import { BranchesService } from './branches.service';
import { Branch } from './entities/branch.entity';
import { ProductStock } from './entities/product-stock.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BranchesService', () => {
  let service: BranchesService;
  let mockBranchRepository: any;
  let mockProductStockRepository: any;

  beforeEach(async () => {
    // Mock Branch Repository
    mockBranchRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Mock ProductStock Repository
    mockProductStockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchesService,
        {
          provide: getRepositoryToken(Branch),
          useValue: mockBranchRepository,
        },
        {
          provide: getRepositoryToken(ProductStock),
          useValue: mockProductStockRepository,
        },
      ],
    }).compile();

    service = module.get<BranchesService>(BranchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a branch', async () => {
      const branchDto = { name: 'Test Branch' };
      const createdBranch = { id: 1, ...branchDto };
      mockBranchRepository.create.mockReturnValue(createdBranch);
      mockBranchRepository.save.mockResolvedValue(createdBranch);

      const result = await service.create(branchDto);
      expect(mockBranchRepository.create).toHaveBeenCalledWith(branchDto);
      expect(mockBranchRepository.save).toHaveBeenCalled();
      expect(result).toEqual(createdBranch);
    });
  });

  describe('findAll', () => {
    it('should return all branches with stocks', async () => {
      const branches = [{ id: 1, name: 'Main' }];
      mockBranchRepository.find.mockResolvedValue(branches);

      const result = await service.findAll();
      expect(mockBranchRepository.find).toHaveBeenCalledWith({
        relations: ['stocks'],
      });
      expect(result).toEqual(branches);
    });
  });

  describe('updateStock', () => {
    it('should update existing stock', async () => {
      const existingStock = { id: 1, branchId: 1, productId: 1, stock: 10 };
      const newStockQuantity = 20;

      mockProductStockRepository.findOne.mockResolvedValue(existingStock);
      mockProductStockRepository.save.mockImplementation((stock) =>
        Promise.resolve(stock),
      );

      const result = await service.updateStock(1, 1, newStockQuantity);

      expect(mockProductStockRepository.findOne).toHaveBeenCalledWith({
        where: { branchId: 1, productId: 1 },
      });
      expect(existingStock.stock).toBe(newStockQuantity);
      expect(mockProductStockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ stock: 20 }),
      );
    });

    it('should create new stock if not exists', async () => {
      mockProductStockRepository.findOne.mockResolvedValue(null);
      const newStock = { branchId: 1, productId: 1, stock: 30 };
      mockProductStockRepository.create.mockReturnValue(newStock);
      mockProductStockRepository.save.mockResolvedValue({ id: 2, ...newStock });

      const result = await service.updateStock(1, 1, 30);

      expect(mockProductStockRepository.findOne).toHaveBeenCalled();
      expect(mockProductStockRepository.create).toHaveBeenCalledWith(newStock);
      expect(mockProductStockRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 2, ...newStock });
    });
  });
});
