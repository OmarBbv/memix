import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let jwtService: any;

  beforeEach(async () => {
    // Mock UsersService
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    // Mock JwtService
    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data (without password) if validation is successful', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test',
      };
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test',
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if password does not match', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrongPassword',
      );
      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        'notfound@example.com',
        'password',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { id: 1, email: 'test@example.com' };
      jwtService.sign.mockReturnValue('signed-jwt-token');

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
      expect(result).toEqual({ access_token: 'signed-jwt-token' });
    });
  });

  describe('validateGoogleUser', () => {
    const googleUser = {
      email: 'google@example.com',
      name: 'Google User',
      photo: 'photo-url',
      googleId: '123456789',
    };

    it('should return existing user', async () => {
      const existingUser = { id: 1, ...googleUser };
      usersService.findByEmail.mockResolvedValue(existingUser);

      const result = await service.validateGoogleUser(googleUser);
      expect(usersService.findByEmail).toHaveBeenCalledWith(googleUser.email);
      expect(usersService.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingUser);
    });

    it('should create new user if not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      const newUser = { id: 2, ...googleUser };
      usersService.create.mockResolvedValue(newUser);

      const result = await service.validateGoogleUser(googleUser);

      expect(usersService.findByEmail).toHaveBeenCalledWith(googleUser.email);
      expect(usersService.create).toHaveBeenCalled();
      expect(result).toEqual(newUser);
    });
  });
});
