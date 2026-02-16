export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  showOnHome: boolean;
  productsCount?: number;
  children?: Category[];
}

export interface CategoryTreeResponse {
  tree: Category[];
}
