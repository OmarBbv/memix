import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import brandService from '../services/brandService';
import { CreateBrandDto, UpdateBrandDto } from '../types/brand';

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: brandService.getAll,
  });
};

export const useBrand = (id: number) => {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: () => brandService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBrandDto | FormData) => brandService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBrandDto | FormData }) =>
      brandService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brand', data.id] });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => brandService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};
