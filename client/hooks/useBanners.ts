import { useQuery } from '@tanstack/react-query';
import { bannerService, BannerLocation } from '@/services/banner.service';

export const useBanners = (location?: BannerLocation) => {
  return useQuery({
    queryKey: ['banners', location],
    queryFn: () => bannerService.getBanners(location),
    staleTime: 10 * 60 * 1000,
  });
};
