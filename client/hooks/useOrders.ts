import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { Order } from '@/types/order.types';

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders', 'my'],
    queryFn: () => orderService.getMyOrders(),
  });
};

export const useOrder = (id: number) => {
  return useQuery<Order>({
    queryKey: ['orders', id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });
};
