import { httpClientPublic } from "@/lib/httpClient";

export enum BannerLocation {
  HOME_MAIN_SLIDER = 'HOME_MAIN_SLIDER',
  HOME_MIDDLE = 'HOME_MIDDLE',
  SIDEBAR = 'SIDEBAR',
  CATEGORY_HEADER = 'CATEGORY_HEADER',
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  tag: string;
  imageUrl: string;
  mobileImageUrl: string;
  link: string;
  buttonText: string;
  secondaryButtonText: string;
  secondaryLink: string;
  location: BannerLocation;
  order: number;
  isActive: boolean;
  features: Record<string, any>[];
}

class BannerService {
  async getBanners(location?: BannerLocation): Promise<Banner[]> {
    const params = location ? { location } : {};
    const response = await httpClientPublic.get<Banner[]>('/banners', { params });
    return response.data;
  }
}

export const bannerService = new BannerService();
