import { z } from "zod";
import { CampaignType } from "../types/campaign";

export const createCampaignSchema = z.object({
  title: z.string().min(1, "Kampaniya adı mütləqdir"),
  description: z.string().optional(),
  type: z.nativeEnum(CampaignType),
  imageUrl: z.string().optional(),
  badgeText: z.string().optional(),
  badgeColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  link: z.string().optional(),
  couponId: z.any().transform(val => val ? Number(val) : undefined).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true).optional(),
  order: z.number().default(0).optional(),
});

export type CreateCampaignFormValues = z.infer<typeof createCampaignSchema>;
