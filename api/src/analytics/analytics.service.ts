import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Branch } from '../branches/entities/branch.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) { }

  async getSalesStats(startDate?: Date, endDate?: Date) {
    const where: any = { status: OrderStatus.DELIVERED };

    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }

    const orders = await this.orderRepository.find({ where });

    const totalSales = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      period: { startDate, endDate },
    };
  }

  async getDailySales(days: number = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.orderRepository.find({
      where: {
        status: OrderStatus.DELIVERED,
        createdAt: Between(startDate, endDate),
      },
    });

    // Günlük qruplaşdırma
    const dailyStats = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { date, sales: 0, orders: 0 };
      }
      dailyStats[date].sales += Number(order.totalPrice);
      dailyStats[date].orders += 1;
    });

    return Object.values(dailyStats);
  }

  async getMonthlySales(months: number = 6) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const orders = await this.orderRepository.find({
      where: {
        status: OrderStatus.DELIVERED,
        createdAt: Between(startDate, endDate),
      },
    });

    // Aylıq qruplaşdırma
    const monthlyStats = {};
    orders.forEach((order) => {
      const month = order.createdAt.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyStats[month]) {
        monthlyStats[month] = { month, sales: 0, orders: 0 };
      }
      monthlyStats[month].sales += Number(order.totalPrice);
      monthlyStats[month].orders += 1;
    });

    return Object.values(monthlyStats);
  }

  async getTopSellingProducts(limit: number = 10) {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('SUM(item.quantity)', 'totalSold')
      .addSelect('SUM(item.quantity * item.price)', 'totalRevenue')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .groupBy('product.id')
      .addGroupBy('product.name')
      .orderBy('totalSold', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      totalSold: parseInt(item.totalSold),
      totalRevenue: parseFloat(item.totalRevenue),
    }));
  }

  async getRevenueReport(startDate?: Date, endDate?: Date) {
    const where: any = { status: OrderStatus.DELIVERED };

    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }

    const orders = await this.orderRepository.find({ where });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);
    const totalOrders = orders.length;

    // Status üzrə qruplaşdırma
    const allOrders = await this.orderRepository.find({
      where: startDate && endDate ? { createdAt: Between(startDate, endDate) } : {},
    });

    const ordersByStatus = allOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRevenue,
      completedOrders: totalOrders,
      ordersByStatus,
      period: { startDate, endDate },
    };
  }

  async getUserActivity() {
    const totalUsers = await this.userRepository.count();
    const usersWithOrders = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.orders', 'order')
      .select('COUNT(DISTINCT user.id)', 'count')
      .where('order.id IS NOT NULL')
      .getRawOne();

    const activeUsers = parseInt(usersWithOrders.count) || 0;
    const inactiveUsers = totalUsers - activeUsers;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      activityRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
    };
  }

  async getBranchPerformance() {
    const branches = await this.branchRepository.find({ relations: ['stocks'] });

    const performance = await Promise.all(
      branches.map(async (branch) => {
        // Filialın məhsullarının satışlarını hesablayırıq
        const totalStock = branch.stocks.reduce((sum, stock) => sum + stock.stock, 0);
        const productCount = branch.stocks.length;

        return {
          branchId: branch.id,
          branchName: branch.name,
          totalProducts: productCount,
          totalStock,
          address: branch.address,
        };
      }),
    );

    return performance;
  }

  async getDashboardOverview() {
    const [sales, topProducts, userActivity, revenue] = await Promise.all([
      this.getSalesStats(),
      this.getTopSellingProducts(5),
      this.getUserActivity(),
      this.getRevenueReport(),
    ]);

    return {
      sales,
      topProducts,
      userActivity,
      revenue,
    };
  }
}
