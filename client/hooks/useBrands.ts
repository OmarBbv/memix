import { useQuery } from '@tanstack/react-query';
import { brandService } from '@/services/brand.service';

export const useBrands = (params?: { showOnHome?: boolean }) => {
  return useQuery({
    queryKey: ['brands', params],
    queryFn: () => brandService.getBrands(params),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
