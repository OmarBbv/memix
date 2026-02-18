export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
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
