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
  colorVariants?: {
    id: number;
    color: string;
    images: string[];
    stocks: {
      id: number;
      size: string;
      stock: number;
    }[];
  }[];
  category?: {
    id: number;
    name: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  categoryId?: number;
  brandId?: number;
  variants: Record<string, any>;
  banner: string;
  tags: string[];
  isFeatured: boolean;
  listingType?: 'new' | 'used';
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
  listingType?: 'new' | 'used';
}

export interface UpdateProductDto extends Partial<CreateProductDto> { }

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number | string;
  minPrice?: number | string;
  maxPrice?: number | string;
  brand?: string | string[] | number;
  color?: string | string[];
  size?: string | string[];
  sort?: 'popular' | 'newest' | string;
  listingType?: string | string[];
}

export interface ProductStats {
  totalStock: number;
  totalValue: number;
}
