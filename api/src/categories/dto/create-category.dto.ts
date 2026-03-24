import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { SizeType } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === 'null' || value === '' || value === 'undefined'
      ? null
      : Number(value),
  )
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  order?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  showOnHome?: boolean;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === 'null' ? null : (value as SizeType),
  )
  sizeType?: SizeType | null;
}
