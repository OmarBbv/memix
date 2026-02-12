export class CreateProductDto {
  name: string; // Məhsulun adı
  description?: string; // Təsviri (Məcburi deyil)
  price: number; // Qiyməti
  imageUrl?: string; // Əsas Şəkil URL (Məcburi deyil)
  images?: string[]; // Digər Şəkillər
  stock?: number; // Stok sayı
  category?: string; // Bu silinəcək, aşağıdakı istifadə olunacaq
  categoryId?: number; // Kateqoriya ID-si (Məcburi deyil, məsələn: 1)
  variants?: Record<string, any>; // Variantlar (JSON formatı: { "size": ["S", "M"], "color": ["Red"] })
  isFeatured?: boolean; // Vitrində göstərilsin?
}
