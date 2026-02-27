export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export interface Coupon {
  id: number;
  code: string;
  type: DiscountType;
  value: number;
  minOrderAmount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponDto {
  code: string;
  type: DiscountType;
  value: number;
  minOrderAmount?: number;
  usageLimit?: number;
  expiresAt?: string;
  isActive?: boolean;
}

export interface UpdateCouponDto extends Partial<CreateCouponDto> { }
