import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(2, "Marka adı ən azı 2 simvol olmalıdır"),
  slug: z.string().min(2, "Slug ən azı 2 simvol olmalıdır"),
  logoUrl: z.string().optional(),
  isActive: z.boolean().default(true).optional(),
  showOnHome: z.boolean().default(true).optional(),
  order: z.number().default(0).optional(),
});

export type CreateBrandFormValues = z.infer<typeof createBrandSchema>;
export const updateBrandSchema = createBrandSchema.partial();
export type UpdateBrandFormValues = z.infer<typeof updateBrandSchema>;
