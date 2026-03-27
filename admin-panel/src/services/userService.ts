import axiosInstance from '../api/axiosInstance';
import { User } from '../types/user';

class UserService {
  async getAll(page: number = 1, limit: number = 10, search: string = ''): Promise<{ data: User[], total: number, page: number, totalPages: number }> {
    const response = await axiosInstance.get('/users', {
      params: { page, limit, search }
    });
    return response.data;
  }

  async getById(id: number): Promise<User> {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  }

  async toggleStatus(id: number): Promise<User> {
    const response = await axiosInstance.patch(`/users/${id}/toggle-status`);
    return response.data;
  }

  async clearUserCart(id: number): Promise<void> {
    await axiosInstance.delete(`/carts/admin/clear/${id}`);
  }
}

export default new UserService();
