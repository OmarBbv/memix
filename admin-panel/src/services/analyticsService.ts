import axiosInstance from '../api/axiosInstance';

export interface DashboardOverview {
  sales: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    period: { startDate: string; endDate: string };
  };
  topProducts: Array<{
    productId: number;
    productName: string;
    totalSold: number;
    totalRevenue: number;
  }>;
  userActivity: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    activityRate: number;
  };
  revenue: {
    totalRevenue: number;
    completedOrders: number;
    ordersByStatus: Record<string, number>;
    period: { startDate: string; endDate: string };
  };
}

export interface MonthlySales {
  month: string;
  sales: number;
  orders: number;
}

class AnalyticsService {
  async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const response = await axiosInstance.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  }

  async getMonthlySales(months: number = 6): Promise<MonthlySales[]> {
    try {
      const response = await axiosInstance.get('/analytics/sales/monthly', {
        params: { months },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly sales:', error);
      throw error;
    }
  }

  async getDailySales(days: number = 7) {
    try {
      const response = await axiosInstance.get('/analytics/sales/daily', {
        params: { days },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching daily sales:', error);
      throw error;
    }
  }

  async getBranchPerformance() {
    try {
      const response = await axiosInstance.get('/analytics/branch-performance');
      return response.data;
    } catch (error) {
      console.error('Error fetching branch performance:', error);
      throw error;
    }
  }

}

const analyticsService = new AnalyticsService();
export default analyticsService;
