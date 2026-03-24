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
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export interface CategoryTreeResponse {
  tree: Category[];
}
