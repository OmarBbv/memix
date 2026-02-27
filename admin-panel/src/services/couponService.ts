import axiosInstance from '../api/axiosInstance';
import { Coupon, CreateCouponDto, UpdateCouponDto } from '../types/coupon';

class CouponService {
  async getAll(): Promise<Coupon[]> {
    const response = await axiosInstance.get('/coupons?all=true');
    return response.data;
  }

  async getById(id: number): Promise<Coupon> {
    const response = await axiosInstance.get(`/coupons/${id}`);
    return response.data;
  }

  async create(data: CreateCouponDto): Promise<Coupon> {
    const response = await axiosInstance.post('/coupons', data);
    return response.data;
  }

  async update(id: number, data: UpdateCouponDto): Promise<Coupon> {
    const response = await axiosInstance.patch(`/coupons/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/coupons/${id}`);
  }
}

export default new CouponService();
