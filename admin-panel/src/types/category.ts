export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
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
  parentId?: number | null;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> { }
