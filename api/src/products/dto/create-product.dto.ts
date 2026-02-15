export class CreateProductDto {
  name: string; // Məhsulun adı
  description?: string; // Təsviri (Məcburi deyil)
  price: number; // Qiyməti
  images?: string[]; // Digər Şəkillər (URL-lər)
  banner?: string; // Vitrin şəkili (URL)
  stock?: number; // Stok sayı
  categoryId?: number; // Kateqoriya ID-si (Məcburi deyil)
  variants?: any; // Variantlar (JSON formatı və ya obyekt)
  tags?: string[]; // Məhsul teqləri
  isFeatured?: boolean; // Vitrində göstərilsin?
}
