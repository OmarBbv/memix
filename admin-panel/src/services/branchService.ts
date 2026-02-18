import axiosInstance from '../api/axiosInstance';
import { CreateBranchDto, Branch, UpdateBranchDto } from '../types/branch';

interface IBranchService {
  getAll(): Promise<Branch[]>;
  getById(id: number): Promise<Branch>;
  create(data: CreateBranchDto): Promise<Branch>;
  update(id: number, data: UpdateBranchDto): Promise<Branch>;
  delete(id: number): Promise<void>;
}

class BranchService implements IBranchService {
  async getAll(): Promise<Branch[]> {
    try {
      const response = await axiosInstance.get('/branches');
      return response.data;
    } catch (error) {
      console.error('Error fetching all branches:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Branch> {
    try {
      const response = await axiosInstance.get(`/branches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching branch with id ${id}:`, error);
      throw error;
    }
  }

  async create(data: CreateBranchDto): Promise<Branch> {
    try {
      const response = await axiosInstance.post('/branches', data);
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateBranchDto): Promise<Branch> {
    try {
      const response = await axiosInstance.patch(`/branches/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating branch with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/branches/${id}`);
    } catch (error) {
      console.error(`Error deleting branch with id ${id}:`, error);
      throw error;
    }
  }
}

const branchService = new BranchService();
export default branchService;
