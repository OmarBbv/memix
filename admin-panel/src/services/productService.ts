import axiosInstance from '../api/axiosInstance';
import { CreateProductDto, Product, UpdateProductDto } from '../types/product';

interface IProductService {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product>;
  create(data: CreateProductDto): Promise<Product>;
  update(id: number, data: UpdateProductDto): Promise<Product>;
  delete(id: number): Promise<void>;
}

class ProductService implements IProductService {
  async getAll(): Promise<Product[]> {
    try {
      const response = await axiosInstance.get('/products');
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

  async create(data: CreateProductDto): Promise<Product> {
    try {
      const response = await axiosInstance.post('/products', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
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
