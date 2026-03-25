import axiosInstance from '../api/axiosInstance';
import { CreateProductDto, Product, ProductQueryParams, UpdateProductDto } from '../types/product';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

interface IProductService {
  getAll(params?: ProductQueryParams): Promise<PaginatedResponse<Product>>;
  getById(id: number): Promise<Product>;
  create(data: CreateProductDto | FormData): Promise<Product>;
  update(id: number, data: UpdateProductDto | FormData): Promise<Product>;
  delete(id: number): Promise<void>;
}

class ProductService implements IProductService {
  async getAll(params: ProductQueryParams = {}): Promise<PaginatedResponse<Product>> {
    try {
      const response = await axiosInstance.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Product> {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  }

  async create(data: CreateProductDto | FormData): Promise<Product> {
    try {
      const response = await axiosInstance.post('/products', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateProductDto | FormData): Promise<Product> {
    try {
      const response = await axiosInstance.patch(`/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  }
}

const productService = new ProductService();
export default productService;
