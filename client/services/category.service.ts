import { httpClientPublic } from "@/lib/httpClient";
import { Category } from "@/types/category.types";

class CategoryService {
  async getTree(): Promise<Category[]> {
    try {
      const response = await httpClientPublic.get('/categories/tree');
      return response.data;
    } catch (error) {
      console.error("CategoryService getTree error:", error);
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
}

export const categoryService = new CategoryService();
