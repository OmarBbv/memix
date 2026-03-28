import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().optional(),
  sku: z.string().optional().or(z.literal('')),
  barcode: z.string().optional().or(z.literal('')),
  gender: z.string().nullish().or(z.literal('')),
  weight: z.coerce.number().optional().or(z.literal(0)),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().nonnegative('Stock must be a non-negative integer').optional(),
  bannerFile: z.any().optional(), // Vitrin şəkli üçün fayl
  images: z.array(z.string()).optional().default([]), // For existing image URLs if editing
  categoryId: z.coerce.number().optional(),
  brandId: z.coerce.number().optional(),
  variantGroupId: z.string().optional().or(z.literal('')),
  isFeatured: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  variants: z.record(z.string(), z.unknown()).optional().default({}),
  colorVariants: z.array(z.object({
    id: z.coerce.number().optional(),
    color: z.string().min(1, 'Color name is required'),
    images: z.array(z.string()).optional().default([]), // existing image URLs
    imageFiles: z.array(z.any()).optional().default([]), // new files to upload
    stocks: z.array(z.object({
      id: z.coerce.number().optional(),
      size: z.string().min(1, 'Size is required'),
      stock: z.coerce.number().int().nonnegative('Stock cannot be negative'),
    })).min(1, 'At least one size stock is required'),
  })).optional().default([]),
  additionalFiles: z.any().optional().default([]),
  banner: z.string().optional().or(z.literal('')),
});

export type ProductFormValues = z.infer<typeof productSchema>;
