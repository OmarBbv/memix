import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.getDashboardOverview();
  }

  @Get('sales')
  getSales(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.analyticsService.getSalesStats(start, end);
  }

  @Get('sales/daily')
  getDailySales(@Query('days') days?: string) {
    return this.analyticsService.getDailySales(days ? parseInt(days) : 7);
  }

  @Get('sales/monthly')
  getMonthlySales(@Query('months') months?: string) {
    return this.analyticsService.getMonthlySales(months ? parseInt(months) : 6);
  }

  @Get('products/top')
  getTopProducts(@Query('limit') limit?: string) {
    return this.analyticsService.getTopSellingProducts(
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('revenue')
  getRevenue(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.analyticsService.getRevenueReport(start, end);
  }

  @Get('users/activity')
  getUserActivity() {
    return this.analyticsService.getUserActivity();
  }

  @Get('branches/performance')
  getBranchPerformance() {
    return this.analyticsService.getBranchPerformance();
  }
}
