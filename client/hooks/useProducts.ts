import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";

export const useProducts = (params?: any) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getAll(params),
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
};
