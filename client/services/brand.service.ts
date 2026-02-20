import { httpClientPublic } from "@/lib/httpClient";

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  isActive: boolean;
  showOnHome: boolean;
  order: number;
}

class BrandService {
  async getBrands(params?: { showOnHome?: boolean }): Promise<Brand[]> {
    const response = await httpClientPublic.get<Brand[]>('/brands', { params });
    return response.data;
  }
}

export const brandService = new BrandService();
