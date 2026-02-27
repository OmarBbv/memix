import { z } from "zod";
import { BannerLocation } from "../types/banner";

export const createBannerSchema = z.object({
  title: z.string().min(3, "Başlıq ən azı 3 simvol olmalıdır"),
  description: z.string().optional(),
  tag: z.string().optional(),
  imageUrl: z.any().optional(),
  mobileImageUrl: z.any().optional(),
  link: z.string().optional(),
  buttonText: z.string().optional(),
  secondaryButtonText: z.string().optional(),
  secondaryLink: z.string().optional(),
  location: z.nativeEnum(BannerLocation).default(BannerLocation.HOME_MAIN_SLIDER).optional(),
  order: z.number().default(0).optional(),
  isActive: z.boolean().default(true).optional(),
});

export type CreateBannerFormValues = z.infer<typeof createBannerSchema>;
export const updateBannerSchema = createBannerSchema.partial();
export type UpdateBannerFormValues = z.infer<typeof updateBannerSchema>;
