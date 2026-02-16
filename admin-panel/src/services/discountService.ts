import axiosInstance from '../api/axiosInstance';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export interface Discount {
  id: number;
  type: DiscountType;
  value: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  productId: number;
}

export interface CreateDiscountDto {
  type: DiscountType;
  value: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  productId: number;
}

export interface UpdateDiscountDto extends Partial<CreateDiscountDto> { }

class DiscountService {
  async getAll(): Promise<Discount[]> {
    const response = await axiosInstance.get('/discounts');
    return response.data;
  }

  async getById(id: number): Promise<Discount> {
    const response = await axiosInstance.get(`/discounts/${id}`);
    return response.data;
  }

  async create(data: CreateDiscountDto): Promise<Discount> {
    const response = await axiosInstance.post('/discounts', data);
    return response.data;
  }

  async update(id: number, data: UpdateDiscountDto): Promise<Discount> {
    const response = await axiosInstance.patch(`/discounts/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/discounts/${id}`);
  }
}

const discountService = new DiscountService();
export default discountService;
