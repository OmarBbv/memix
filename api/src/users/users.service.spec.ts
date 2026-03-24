import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { ErrorMessages } from '../common/constants/error-messages';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository: any;

  beforeEach(async () => {
    // Mock Repository
    mockUsersRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '123456',
    };

    it('should successfully create a user', async () => {
      // Arrange
      mockUsersRepository.findOneBy.mockResolvedValue(null); // İstifadəçi yoxdur
      mockUsersRepository.create.mockReturnValue(createUserDto);
      mockUsersRepository.save.mockImplementation((user) =>
        Promise.resolve({ id: 1, ...user }),
      );

      // Act
      const result = await service.create(createUserDto as any);

      // Assert
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(mockUsersRepository.create).toHaveBeenCalled();
      expect(mockUsersRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: 1,
        ...createUserDto,
        password: 'hashedPassword',
      });
      // Password hash yoxlanılır (biz mock etmişik ki, 'hashedPassword' qaytarsın, amma DTO obyektini dəyişdiyimiz üçün yoxlamaq çətindir, save-ə baxmaq olar)
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      mockUsersRepository.findOneBy.mockResolvedValue({
        id: 1,
        email: createUserDto.email,
      }); // İstifadəçi var

      // Act & Assert
      await expect(service.create(createUserDto as any)).rejects.toThrow(
        new ConflictException(ErrorMessages.USER_ALREADY_EXISTS),
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, email: 'test@example.com' };
      mockUsersRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null if not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findByEmail('notfound@example.com');
      expect(result).toBeNull();
    });
  });
});
