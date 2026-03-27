import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string; // Məhsulun adı

  @IsString()
  @IsOptional()
  description?: string; // Təsviri (Məcburi deyil)

  @IsString()
  @IsOptional()
  sku?: string; // Məhsulun kodu

  @IsString()
  @IsOptional()
  barcode?: string; // Barkerodu

  @IsString()
  @IsOptional()
  gender?: string; // Cinsi

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  weight?: number; // Çəki

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

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  brandId?: number; // Brend ID-si (Zara, Nike və s.)

  @IsOptional()
  variants?: any; // Variantlar (JSON formatı və ya obyekt)

  @IsOptional()
  tags?: any; // Məhsul teqləri (String or Array)

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true || value === 1 || value === '1') return true;
    if (value === 'false' || value === false || value === 0 || value === '0') return false;
    return value;
  })
  isFeatured?: boolean; // Vitrində göstərilsin?

  @IsOptional()
  branchStocks?: any; // { branchId: number, stock: number }[] (JSON format if multipart)

  @IsOptional()
  existingBanner?: string;

  @IsOptional()
  existingImages?: string | string[];
}
