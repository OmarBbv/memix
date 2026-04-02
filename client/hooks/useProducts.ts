import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { productService } from "@/services/product.service";

export const useProducts = (params?: any) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getAll(params),
  });
};

export const useInfiniteProducts = (params?: any) => {
  return useInfiniteQuery({
    queryKey: ["products-infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      productService.getAll({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });
};

export const useProductFilters = (params?: any) => {
  return useQuery({
    queryKey: ["productFilters", params],
    queryFn: () => productService.getFilters(params),
    enabled: true,
    placeholderData: keepPreviousData,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
};

export const useNewArrivals = (limit: number = 8) => {
  return useQuery({
    queryKey: ["newArrivals", limit],
    queryFn: () => productService.getNewArrivals(limit),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useSimilarProducts = (id: number, limit: number = 4) => {
  return useQuery({
    queryKey: ["similarProducts", id, limit],
    queryFn: () => productService.getSimilarProducts(id, limit),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
