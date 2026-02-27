import { Product } from "../lib/products";

export enum CampaignType {
  DISCOUNT = 'discount',
  BUY_X_GET_Y = 'buy_x_get_y',
  FREE_SHIPPING = 'free_shipping',
  BUNDLE = 'bundle',
}

export interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  coupon?: Coupon;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountProduct {
  discount: {
    id: number;
    type: 'percentage' | 'fixed';
    value: number;
  };
  product: Product;
}

export interface PromotionsResponse {
  campaigns: Campaign[];
  coupons: Coupon[];
  discountedProducts: DiscountProduct[];
}
