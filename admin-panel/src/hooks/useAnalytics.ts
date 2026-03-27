import { useQuery } from '@tanstack/react-query';
import analyticsService from '../services/analyticsService';

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsService.getDashboardOverview(),
  });
};

export const useMonthlySales = (months: number = 6) => {
  return useQuery({
    queryKey: ['analytics', 'monthly-sales', months],
    queryFn: () => analyticsService.getMonthlySales(months),
  });
};

export const useDailySales = (days: number = 7) => {
  return useQuery({
    queryKey: ['analytics', 'daily-sales', days],
    queryFn: () => analyticsService.getDailySales(days),
  });
};

export const useBranchPerformance = () => {
  return useQuery({
    queryKey: ['analytics', 'branch-performance'],
    queryFn: () => analyticsService.getBranchPerformance(),
  });
};
