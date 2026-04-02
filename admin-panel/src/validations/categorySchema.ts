import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Kateqoriya adı ən azı 2 simvol olmalıdır'),
  parentId: z.preprocess((val) => (val === "" ? null : Number(val)), z.number().nullable()).optional(),
  imageUrl: z.string().optional().or(z.literal('')),
  order: z.preprocess((val) => Number(val), z.number()).default(0),
  isActive: z.boolean().default(true),
  showOnHome: z.boolean().default(false),
  sizeType: z.string().optional().or(z.literal('')),
  skuPrefixUsed: z.string().optional().or(z.literal('')),
  skuPrefixNew: z.string().optional().or(z.literal('')),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
