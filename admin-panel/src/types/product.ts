export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku?: string;
  barcode?: string;
  gender?: string;
  weight?: number;
  imageUrl: string;
  images: string[];
  stock: number;
  stocks?: {
    id: number;
    stock: number;
    branchId: number;
    branch: {
      id: number;
      name: string;
    };
  }[];
  category?: {
    id: number;
    name: string;
  };
  categoryId?: number;
  variants: Record<string, any>;
  banner: string;
  tags: string[];
  isFeatured: boolean;
  discount?: {
    id: number;
    type: 'percentage' | 'fixed';
    value: number;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  sku?: string;
  barcode?: string;
  gender?: string;
  weight?: number;
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

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number | string;
  minPrice?: number | string;
  maxPrice?: number | string;
  brand?: string | string[];
  color?: string | string[];
  size?: string | string[];
  sort?: 'popular' | 'newest' | string;
}
