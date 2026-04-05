import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { WarehouseLogService } from '../services/WarehouseLogService';
import { CreateWarehouseLogDto, WarehouseStats } from '../types/warehouse-log';

export const useWarehouseLogs = () => {
  return useQuery({
    queryKey: ['warehouse-logs'],
    queryFn: () => WarehouseLogService.getAll(),
  });
};

export const useCreateWarehouseLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWarehouseLogDto) => WarehouseLogService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-logs'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-stats'] });
    },
  });
};

export const useDeleteWarehouseLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => WarehouseLogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-logs'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-stats'] });
    },
  });
};

export const useWarehouseStats = (startDate?: string, endDate?: string): UseQueryResult<WarehouseStats[], Error> => {
  return useQuery({
    queryKey: ['warehouse-stats', startDate, endDate],
    queryFn: () => WarehouseLogService.getStats(startDate, endDate),
  });
};
