import { httpClientPublic } from "@/lib/httpClient";

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  banner?: string;
  stock?: number;
  category?: {
    id: number;
    name: string;
  };
  variants?: any;
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
    price: string | number;
    changedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

export const productService = {
  async getAll(params?: any) {
    const response = await httpClientPublic.get<Product[]>('/products', { params });
    return response.data;
  },

  async getById(id: number) {
    const response = await httpClientPublic.get<Product>(`/products/${id}`);
    return response.data;
  }
};
