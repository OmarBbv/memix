import axiosInstance from '../api/axiosInstance';
import { Order, OrderStatus } from '../types/order';

interface IOrderService {
  getAll(search?: string, status?: OrderStatus): Promise<Order[]>;
  getById(id: number): Promise<Order>;
  updateStatus(id: number, status: OrderStatus): Promise<Order>;
  delete(id: number): Promise<void>;
  downloadInvoice(id: number): Promise<void>;
}

class OrderService implements IOrderService {
  async getAll(search?: string, status?: OrderStatus): Promise<Order[]> {
    try {
      const response = await axiosInstance.get('/orders', {
        params: { search, status }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Order> {
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with id ${id}:`, error);
      throw error;
    }
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    try {
      const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating order status for id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/orders/${id}`);
    } catch (error) {
      console.error(`Error deleting order with id ${id}:`, error);
      throw error;
    }
  }

  async downloadInvoice(id: number): Promise<void> {
    const response = await axiosInstance.get(`/orders/${id}/invoice`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

const orderService = new OrderService();
export default orderService;
