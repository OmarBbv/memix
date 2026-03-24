export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  showOnHome: boolean;
  sizeType?: string | null;
  productsCount?: number;
  children?: Category[];
  parent?: Category;
  parentId?: number;
  products?: any[];
}

export interface CategoryTreeResponse {
  tree: Category[];
}
