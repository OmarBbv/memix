import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { DiscountType } from '../entities/discount.entity';

export class CreateDiscountDto {
  @IsEnum(DiscountType)
  type: DiscountType;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsNumber()
  productId: number;
}
