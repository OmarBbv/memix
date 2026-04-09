import { IsEmail, IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { UserType } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  googleId?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsEnum(UserType)
  @IsOptional()
  userType?: UserType;

  @IsNumber()
  @IsOptional()
  roleId?: number;
}
