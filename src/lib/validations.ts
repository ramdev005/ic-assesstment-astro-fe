import { z } from 'zod';
import { CURRENCY_OPTIONS, CATEGORY_OPTIONS } from './constants';

/**
 * Zod validation schemas for form validation
 */

// Product validation schemas
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(50, 'SKU must be less than 50 characters')
    .regex(/^[A-Z0-9-_]+$/, 'SKU must contain only uppercase letters, numbers, hyphens, and underscores')
    .trim(),
  price: z
    .number()
    .min(0.01, 'Price must be greater than 0')
    .max(999999.99, 'Price must be less than 1,000,000'),
  stockQuantity: z
    .number()
    .int('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative'),
  category: z
    .string()
    .refine((val) => val === '' || CATEGORY_OPTIONS.some(option => option.value === val), {
      message: 'Please select a valid category'
    })
    .optional()
    .or(z.literal('')),
  images: z
    .array(z.string())
    .transform((arr) => arr.filter((url) => url.trim() !== ''))
    .refine((arr) => arr.every((url) => z.string().url().safeParse(url).success), {
      message: 'Invalid image URL',
    })
    .default([]),
  brand: z
    .string()
    .max(50, 'Brand must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  currency: z
    .string()
    .refine((val) => CURRENCY_OPTIONS.some(option => option.value === val), {
      message: 'Please select a valid currency'
    })
    .default('USD'),
});

export const updateProductSchema = createProductSchema.partial();

export const stockUpdateSchema = z.object({
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
});

// Type exports
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type StockUpdateFormData = z.infer<typeof stockUpdateSchema>;
