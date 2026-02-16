import axiosInstance from '../api/axiosInstance';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category';

interface ICategoryService {
  getAll(): Promise<Category[]>;
  getTree(): Promise<Category[]>;
  getById(id: number): Promise<Category>;
  create(data: CreateCategoryDto | FormData): Promise<Category>;
  update(id: number, data: UpdateCategoryDto | FormData): Promise<Category>;
  delete(id: number): Promise<void>;
}

class CategoryService implements ICategoryService {
  async getAll(): Promise<Category[]> {
    try {
      const response = await axiosInstance.get('/categories?all=true');
      return response.data;
    } catch (error) {
      console.error('Error fetching all categories:', error);
      throw error;
    }
  }

  async getTree(): Promise<Category[]> {
    try {
      const response = await axiosInstance.get('/categories/tree?all=true');
      return response.data;
    } catch (error) {
      console.error('Error fetching category tree:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Category> {
    try {
      const response = await axiosInstance.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      throw error;
    }
  }

  async create(data: CreateCategoryDto | FormData): Promise<Category> {
    try {
      const response = await axiosInstance.post('/categories', data, {
        headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
      });
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateCategoryDto | FormData): Promise<Category> {
    try {
      const response = await axiosInstance.patch(`/categories/${id}`, data, {
        headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/categories/${id}`);
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;
