import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().optional(),
  sku: z.string().optional().or(z.literal('')),
  barcode: z.string().optional().or(z.literal('')),
  gender: z.string().nullish().or(z.literal('')),
  weight: z.coerce.number().optional().or(z.literal(0)),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().nonnegative('Stock must be a non-negative integer'),
  bannerFile: z.any().optional(), // Vitrin şəkli üçün fayl
  additionalFiles: z.any().optional(), // Digər şəkillər üçün fayllar
  images: z.array(z.string()).optional().default([]), // For existing image URLs if editing
  categoryId: z.coerce.number().optional(),
  brandId: z.coerce.number().optional(),
  isFeatured: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  variants: z.record(z.string(), z.unknown()).optional().default({}),
  branchStocks: z.array(z.object({
    branchId: z.coerce.number(),
    stock: z.coerce.number().int().nonnegative(),
    size: z.string().optional().default(''),
    color: z.string().optional().default(''),
  })).optional().default([]),
  banner: z.string().optional().or(z.literal('')),
});

export type ProductFormValues = z.infer<typeof productSchema>;
