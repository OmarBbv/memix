import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WarehouseLogService } from '../services/WarehouseLogService';
import { CreateWarehouseLogDto } from '../types/warehouse-log';

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
    },
  });
};

export const useDeleteWarehouseLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => WarehouseLogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-logs'] });
    },
  });
};
