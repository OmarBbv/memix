import axiosInstance from '../api/axiosInstance';
import { Brand, CreateBrandDto, UpdateBrandDto } from '../types/brand';

class BrandService {
  async getAll(): Promise<Brand[]> {
    const response = await axiosInstance.get('/brands?all=true');
    return response.data;
  }

  async getById(id: number): Promise<Brand> {
    const response = await axiosInstance.get(`/brands/${id}`);
    return response.data;
  }

  async create(data: CreateBrandDto | FormData): Promise<Brand> {
    const response = await axiosInstance.post('/brands', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  }

  async update(id: number, data: UpdateBrandDto | FormData): Promise<Brand> {
    const response = await axiosInstance.patch(`/brands/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/brands/${id}`);
  }
}

export default new BrandService();
