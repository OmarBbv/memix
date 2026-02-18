import { IsString, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string; // Məhsulun adı

  @IsString()
  @IsOptional()
  description?: string; // Təsviri (Məcburi deyil)

  @IsNumber()
  @Type(() => Number)
  price: number; // Qiyməti

  @IsArray()
  @IsOptional()
  images?: string[]; // Digər Şəkillər (URL-lər)

  @IsString()
  @IsOptional()
  banner?: string; // Vitrin şəkili (URL)

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  stock?: number; // Stok sayı

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number; // Kateqoriya ID-si (Məcburi deyil)

  @IsOptional()
  variants?: any; // Variantlar (JSON formatı və ya obyekt)

  @IsOptional()
  tags?: any; // Məhsul teqləri (String or Array)

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isFeatured?: boolean; // Vitrində göstərilsin?

  @IsOptional()
  branchStocks?: any; // { branchId: number, stock: number }[] (JSON format if multipart)

  @IsOptional()
  existingBanner?: string;

  @IsOptional()
  existingImages?: string | string[];
}
