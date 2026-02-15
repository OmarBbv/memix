import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().nonnegative('Stock must be a non-negative integer'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  images: z.array(z.string().url('Invalid image URL')).optional().default([]),
  categoryId: z.coerce.number().optional(),
  isFeatured: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  variants: z.record(z.string(), z.unknown()).optional().default({}),
  banner: z.string().optional().or(z.literal('')),
});

export type ProductFormValues = z.infer<typeof productSchema>;
