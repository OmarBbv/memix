import axiosInstance from '../api/axiosInstance';
import { Banner, CreateBannerDto, UpdateBannerDto } from '../types/banner';

class BannerService {
  async getAll(): Promise<Banner[]> {
    const response = await axiosInstance.get('/banners?all=true');
    return response.data;
  }

  async getById(id: number): Promise<Banner> {
    const response = await axiosInstance.get(`/banners/${id}`);
    return response.data;
  }

  async create(data: CreateBannerDto | FormData): Promise<Banner> {
    const response = await axiosInstance.post('/banners', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  }

  async update(id: number, data: UpdateBannerDto | FormData): Promise<Banner> {
    const response = await axiosInstance.patch(`/banners/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/banners/${id}`);
  }
}

export default new BannerService();
