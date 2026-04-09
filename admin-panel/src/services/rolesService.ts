import axiosInstance from '../api/axiosInstance';
import { Role, IRolesService } from '../types/role';

class RolesService implements IRolesService {
  async getAll(): Promise<Role[]> {
    try {
      const response = await axiosInstance.get('/roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  async create(role: Partial<Role>): Promise<Role> {
    try {
      const response = await axiosInstance.post('/roles', role);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  async update(id: number, role: Partial<Role>): Promise<Role> {
    try {
      const response = await axiosInstance.patch(`/roles/${id}`, role);
      return response.data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/roles/${id}`);
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }
}

export const rolesService = new RolesService();
