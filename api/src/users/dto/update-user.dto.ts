import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  phone?: string;
  birthday?: string;
  gender?: any;
  currentPassword?: string;
  newPassword?: string;
}
