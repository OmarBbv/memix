import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { autoDiscountService } from '../services/autoDiscountService';

export const usePendingDiscounts = () => {
  return useQuery({
    queryKey: ['pending-discounts'],
    queryFn: () => autoDiscountService.getPending(),
  });
};

export const useApproveBulkDiscounts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productIds: number[]) =>
      autoDiscountService.approveBulk(productIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-discounts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};

export const useTriggerAutoDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => autoDiscountService.triggerAuto(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-discounts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};
