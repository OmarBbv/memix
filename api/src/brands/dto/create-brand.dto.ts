import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  showOnHome?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}
