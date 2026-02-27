import { z } from "zod";
import { DiscountType } from "../types/coupon";

export const createCouponSchema = z.object({
  code: z.string().min(3, "Kupon kodu ən azı 3 simvol olmalıdır"),
  type: z.nativeEnum(DiscountType),
  value: z.number().min(0, "Endirim dəyəri 0-dan böyük olmalıdır"),
  minOrderAmount: z.number().optional(),
  usageLimit: z.number().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean().default(true).optional()
});

export type CreateCouponFormValues = z.infer<typeof createCouponSchema>;
export const updateCouponSchema = createCouponSchema.partial();
export type UpdateCouponFormValues = z.infer<typeof updateCouponSchema>;
