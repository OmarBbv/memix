import axiosInstance from '../api/axiosInstance';
import { Campaign, CreateCampaignDto, UpdateCampaignDto } from '../types/campaign';

class CampaignService {
  async getAll(): Promise<Campaign[]> {
    const response = await axiosInstance.get('/campaigns');
    return response.data;
  }

  async getById(id: number): Promise<Campaign> {
    const response = await axiosInstance.get(`/campaigns/${id}`);
    return response.data;
  }

  async create(data: CreateCampaignDto): Promise<Campaign> {
    const response = await axiosInstance.post('/campaigns', data);
    return response.data;
  }

  async update(id: number, data: UpdateCampaignDto): Promise<Campaign> {
    const response = await axiosInstance.patch(`/campaigns/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/campaigns/${id}`);
  }
}

export default new CampaignService();
