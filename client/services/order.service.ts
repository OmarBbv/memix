import { httpClientPrivate } from "@/lib/httpClient";

export interface CreateOrderDto {
  address: string;
  phone: string;
  branchId: number;
}

class OrderService {
  async createOrder(data: CreateOrderDto) {
    try {
      const response = await httpClientPrivate.post('/orders', data);
      return response.data;
    } catch (error) {
      console.error("OrderService createOrder error:", error);
      throw error;
    }
  }

  async getMyOrders() {
    try {
      const response = await httpClientPrivate.get('/orders/my');
      return response.data;
    } catch (error) {
      console.error("OrderService getMyOrders error:", error);
      throw error;
    }
  }

  async getOrder(id: number) {
    try {
      const response = await httpClientPrivate.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error("OrderService getOrder error:", error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
