import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import bannerService from '../services/bannerService';
import { CreateBannerDto, UpdateBannerDto } from '../types/banner';

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: bannerService.getAll,
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBannerDto | FormData) => bannerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBannerDto | FormData }) =>
      bannerService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['banner', data.id] });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bannerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};
