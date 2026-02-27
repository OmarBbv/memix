import { useQuery } from '@tanstack/react-query';
import { promotionsService } from '../services/promotions.service';
import { PromotionsResponse } from '../types/promotions.types';

export const usePromotions = () => {
  return useQuery<PromotionsResponse>({
    queryKey: ['promotions'],
    queryFn: () => promotionsService.getPromotions(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
