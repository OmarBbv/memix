export enum CampaignType {
  DISCOUNT = 'discount',
  BUY_X_GET_Y = 'buy_x_get_y',
  FREE_SHIPPING = 'free_shipping',
  BUNDLE = 'bundle',
}

export interface Campaign {
  id: number;
  title: string;
  description?: string;
  type: CampaignType;
  imageUrl?: string;
  badgeText?: string;
  badgeColor?: string;
  backgroundColor?: string;
  link?: string;
  couponId?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  title: string;
  description?: string;
  type: CampaignType;
  imageUrl?: string;
  badgeText?: string;
  badgeColor?: string;
  backgroundColor?: string;
  link?: string;
  couponId?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateCampaignDto extends Partial<CreateCampaignDto> { }
