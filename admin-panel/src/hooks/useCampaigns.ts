import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import campaignService from '../services/campaignService';
import { CreateCampaignDto, UpdateCampaignDto } from '../types/campaign';

export const useCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignService.getAll,
  });
};

export const useCampaign = (id: number) => {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCampaignDto) => campaignService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCampaignDto }) =>
      campaignService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', data.id] });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => campaignService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useApplyBulkDiscount = () => {
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: number; 
      data: { targetType: 'category' | 'brand'; targetId: number; discountType: 'percentage' | 'fixed'; discountValue: number } 
    }) => campaignService.applyBulkDiscount(id, data),
  });
};

export const useRemoveBulkDiscount = () => {
  return useMutation({
    mutationFn: (id: number) => campaignService.removeBulkDiscount(id),
  });
};
