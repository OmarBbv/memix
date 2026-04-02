import axiosInstance from "../api/axiosInstance";
import { CreateWarehouseLogDto, WarehouseLog } from "../types/warehouse-log";

export class WarehouseLogService {
  static async getAll(): Promise<WarehouseLog[]> {
    const response = await axiosInstance.get('/warehouse-logs');
    return response.data;
  }

  static async create(data: CreateWarehouseLogDto): Promise<WarehouseLog> {
    const response = await axiosInstance.post('/warehouse-logs', data);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/warehouse-logs/${id}`);
  }
}
