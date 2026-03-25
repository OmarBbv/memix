export enum SizeType {
  BEDEN_TEXT = 'beden-text', // XS, S, M, L, XL, XXL, 3XL
  BEDEN_NUMERIC = 'beden-numeric', // 28, 30, 32, 34, 36, 38, 40, 42, 44
  AYAQQABI = 'ayaqqabi', // 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45
  UZUK = 'uzuk', // 14, 15, 16, 17, 18, 19, 20, 21, 22
  TEK_OLCU = 'tek-olcu', // STD (Standart)
  YAS_GRUPU = 'yas-grupu', // 0-3 ay, 3-6 ay, 6-12 ay, 1-2 yaş...
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  showOnHome: boolean;
  sizeType: SizeType | null;
  parentId?: number;
  parent?: Category;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
  showOnHome?: boolean;
  parentId?: number | null;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> { }
