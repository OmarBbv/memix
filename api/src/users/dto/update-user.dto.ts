import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserGender } from '../entities/user.entity';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  birthday?: string;

  @IsEnum(UserGender)
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  gender?: UserGender;

  @IsString()
  @IsOptional()
  currentPassword?: string;

  @IsString()
  @IsOptional()
  newPassword?: string;
}
