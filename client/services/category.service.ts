import { httpClientPublic } from "@/lib/httpClient";
import { Category } from "@/types/category.types";

interface ICategoryService {
  getTree(): Promise<Category[]>;
  getHomeCategories(): Promise<Category[]>;
  getAll(): Promise<Category[]>;
  getBySlug(slug: string, filters?: Record<string, string>): Promise<Category>;
  getFilters(id: number): Promise<any>;
}

class CategoryService implements ICategoryService {
  async getTree(): Promise<Category[]> {
    try {
      const response = await httpClientPublic.get('/categories/tree');
      return response.data;
    } catch (error) {
      console.error("CategoryService getTree error:", error);
      throw error;
    }
  }

  async getHomeCategories(): Promise<Category[]> {
    try {
      const response = await httpClientPublic.get('/categories/home');
      return response.data;
    } catch (error) {
      console.error("CategoryService getHomeCategories error:", error);
      throw error;
    }
  }

  async getAll(): Promise<Category[]> {
    try {
      const response = await httpClientPublic.get('/categories');
      return response.data;
    } catch (error) {
      console.error("CategoryService getAll error:", error);
      throw error;
    }
  }

  async getBySlug(slug: string, filters?: Record<string, string>): Promise<Category> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });
      }
      const qs = params.toString();
      const url = `/categories/slug/${slug}${qs ? `?${qs}` : ''}`;
      const response = await httpClientPublic.get(url);
      return response.data;
    } catch (error) {
      console.error(`CategoryService getBySlug error for ${slug}:`, error);
      throw error;
    }
  }

  async getFilters(id: number): Promise<any> {
    try {
      const response = await httpClientPublic.get(`/categories/${id}/filters`);
      return response.data;
    } catch (error) {
      console.error(`CategoryService getFilters error for ${id}:`, error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
