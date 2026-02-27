export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
  showOnHome: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandDto {
  name: string;
  slug: string;
  logoUrl?: string;
  isActive?: boolean;
  showOnHome?: boolean;
  order?: number;
}

export interface UpdateBrandDto extends Partial<CreateBrandDto> { }
