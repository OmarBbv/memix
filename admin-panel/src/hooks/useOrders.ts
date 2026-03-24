import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import orderService from "../services/orderService";
import { OrderStatus } from "../types/order";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.getAll(),
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => orderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
