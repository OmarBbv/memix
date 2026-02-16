import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import discountService, { CreateDiscountDto, UpdateDiscountDto } from "../services/discountService";

export const useDiscounts = () => {
  return useQuery({
    queryKey: ["discounts"],
    queryFn: () => discountService.getAll(),
  });
};

export const useDiscount = (id: number) => {
  return useQuery({
    queryKey: ["discounts", id],
    queryFn: () => discountService.getById(id),
    enabled: !!id,
  });
};

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDiscountDto) => discountService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDiscountDto }) =>
      discountService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => discountService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
