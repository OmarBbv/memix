import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ErrorMessages } from '../common/constants/error-messages';

import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(ErrorMessages.USER_ALREADY_EXISTS);
    }

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    }
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }
    return user;
  }

  async findAll(
    currentUserId: number,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: User[]; total: number; page: number; limit: number; totalPages: number }> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    queryBuilder.where('user.id != :currentUserId', { currentUserId });

    if (search) {
      queryBuilder.andWhere(
        '(CAST(user.id AS TEXT) LIKE :search OR LOWER(user.name) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search) OR LOWER(user.surname) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('user.id', 'DESC');

    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.surname !== undefined) user.surname = updateUserDto.surname;
    if (updateUserDto.email !== undefined) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(ErrorMessages.USER_ALREADY_EXISTS);
      }
      user.email = updateUserDto.email;
    }
    if (updateUserDto.phone !== undefined) user.phone = updateUserDto.phone;
    if (updateUserDto.birthday !== undefined) user.birthday = updateUserDto.birthday;
    if (updateUserDto.gender !== undefined) user.gender = updateUserDto.gender;

    if (updateUserDto.newPassword) {
      if (user.password) {
        if (!updateUserDto.currentPassword) {
          throw new BadRequestException('Mevcut şifre gerekli');
        }

        const isPasswordValid = await bcrypt.compare(
          updateUserDto.currentPassword,
          user.password,
        );

        if (!isPasswordValid) {
          throw new BadRequestException('Mevcut şifre yanlış');
        }
      }

      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(updateUserDto.newPassword, salt);
    }

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }
}
