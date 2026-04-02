import axiosInstance from '../api/axiosInstance';
import { PendingDiscount } from '../types/pending-discount';

interface IAutoDiscountService {
  getPending(): Promise<PendingDiscount[]>;
  approveBulk(productIds: number[]): Promise<{ applied: number }>;
  triggerAuto(): Promise<void>;
}

class AutoDiscountService implements IAutoDiscountService {
  async getPending(): Promise<PendingDiscount[]> {
    const response = await axiosInstance.get('/discounts/pending');
    return response.data;
  }

  async approveBulk(productIds: number[]): Promise<{ applied: number }> {
    const response = await axiosInstance.post('/discounts/approve-bulk', {
      productIds,
    });
    return response.data;
  }

  async triggerAuto(): Promise<void> {
    await axiosInstance.post('/discounts/trigger-auto');
  }
}

export const autoDiscountService = new AutoDiscountService();
