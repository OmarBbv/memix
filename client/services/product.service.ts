import { httpClientPublic } from "@/lib/httpClient";

export type Product = {
  id: number;
  name: string;
  title?: string;
  description?: string;
  price: number | string;
  oldPrice?: number;
  image?: string;
  images?: string[];
  banner?: string;
  brand?: string;
  size?: string | string[];
  condition?: string;
  city?: string;
  storePriceFactor?: number;
  category?: {
    id: number;
    name: string;
    slug?: string;
    imageUrl?: string | null;
  };
  variants?: {
    size?: string[];
    brand?: string;
    color?: string;
    condition?: string;
    city?: string;
    [key: string]: any;
  };
  tags?: string[];
  isFeatured?: boolean;
  discount?: {
    id: number;
    type: 'percentage' | 'fixed';
    value: number;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
  };
  priceHistory?: {
    id: number;
    oldPrice?: string | number;
    newPrice?: string | number;
    price?: string | number;
    changedAt: string;
  }[];
  stocks?: {
    id: number;
    stock: number;
    branch: {
      id: number;
      name: string;
    };
  }[];
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedResponse = {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

export const productService = {
  async getAll(params?: any): Promise<PaginatedResponse> {
    const response = await httpClientPublic.get<PaginatedResponse>('/products', { params });
    return response.data;
  },

  async getFilters(params?: any): Promise<any> {
    const response = await httpClientPublic.get('/products/filters', { params });
    return response.data;
  },

  async getById(id: number) {
    const response = await httpClientPublic.get<Product>(`/products/${id}`);
    return response.data;
  },

  async getNewArrivals(limit: number = 8) {
    const response = await httpClientPublic.get<Product[]>('/products/new-arrivals', {
      params: { limit }
    });
    return response.data;
  },

  async getSimilarProducts(id: number, limit: number = 4) {
    const response = await httpClientPublic.get<Product[]>(`/products/${id}/similar`, {
      params: { limit }
    });
    return response.data;
  }
};
