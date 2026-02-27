export enum BannerLocation {
  HOME_MAIN_SLIDER = 'HOME_MAIN_SLIDER',
  HOME_MIDDLE = 'HOME_MIDDLE',
  SIDEBAR = 'SIDEBAR',
  CATEGORY_HEADER = 'CATEGORY_HEADER',
}

export interface Banner {
  id: number;
  title: string;
  description?: string;
  tag?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  link?: string;
  buttonText?: string;
  secondaryButtonText?: string;
  secondaryLink?: string;
  location: BannerLocation;
  order: number;
  isActive: boolean;
  features?: Record<string, any>[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerDto {
  title: string;
  description?: string;
  tag?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  link?: string;
  buttonText?: string;
  secondaryButtonText?: string;
  secondaryLink?: string;
  location?: BannerLocation;
  order?: number;
  isActive?: boolean;
  features?: Record<string, any>[];
}

export interface UpdateBannerDto extends Partial<CreateBannerDto> { }
