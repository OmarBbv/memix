import axiosInstance from '../api/axiosInstance';
import { User } from '../types/user';

class UserService {
  async getAll(page: number = 1, limit: number = 10, search: string = ''): Promise<{ data: User[], total: number, page: number, totalPages: number }> {
    try {
      const response = await axiosInstance.get('/users', {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<User> {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  async toggleStatus(id: number): Promise<User> {
    try {
      const response = await axiosInstance.patch(`/users/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling status for user ${id}:`, error);
      throw error;
    }
  }

  async clearUserCart(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/carts/admin/clear/${id}`);
    } catch (error) {
      console.error(`Error clearing cart for user ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  async adminUpdate(id: number, data: { name?: string; surname?: string; email?: string; roleId?: number }): Promise<User> {
    try {
      const response = await axiosInstance.patch(`/users/${id}/admin-update`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async createEmployee(data: any): Promise<User> {
    try {
      const response = await axiosInstance.post('/users/employee', data);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }
}

export default new UserService();
