import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../services/productService';
import { CreateProductDto, ProductQueryParams, UpdateProductDto } from '../types/product';

export const useProducts = (params: ProductQueryParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getAll(params),
    placeholderData: keepPreviousData,
  });
};

export const useAdminProducts = (params: ProductQueryParams = {}) => {
  return useQuery({
    queryKey: ['admin-products', params],
    queryFn: () => productService.getAllAdmin(params),
    placeholderData: keepPreviousData,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductDto }) =>
      productService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};
