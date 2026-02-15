export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  children?: Category[];
}

export interface CategoryTreeResponse {
  tree: Category[];
}
