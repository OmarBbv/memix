import axiosInstance from '../api/axiosInstance';
import { SizeType, CreateSizeTypeDto, ISizeTypeService } from '../types/sizeType';

class SizeTypeService implements ISizeTypeService {
  async getAll(): Promise<SizeType[]> {
    try {
      const response = await axiosInstance.get('/size-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching size types:', error);
      throw error;
    }
  }

  async create(data: CreateSizeTypeDto): Promise<SizeType> {
    try {
      const response = await axiosInstance.post('/size-types', data);
      return response.data;
    } catch (error) {
      console.error('Error creating size type:', error);
      throw error;
    }
  }
}

export const sizeTypeService = new SizeTypeService();
