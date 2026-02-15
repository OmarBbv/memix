export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  images: string[];
  stock: number;
  category?: {
    id: number;
    name: string;
  };
  categoryId?: number;
  variants: Record<string, any>;
  banner: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  stock: number;
  categoryId?: number;
  variants?: Record<string, any>;
  banner?: string;
  tags?: string[];
  isFeatured?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> { }
