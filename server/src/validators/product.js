import { z } from 'zod';

const bulkPricingItem = z.object({
  min: z.number().int().positive(),
  max: z.number().int().positive().nullable(),
  price: z.number().positive(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  category: z.string().min(1, 'Category ID is required'),
  categoryLabel: z.string().min(1, 'Category label is required'),
  image: z.string().url('Image must be a valid URL').optional(),
  badge: z.enum(['new', 'trending', 'bestseller']).nullable().optional(),
  sizes: z.array(z.string()).optional().default([]),
  availableColors: z.array(z.string()).optional().default([]),
  bulkPricing: z.array(bulkPricingItem).optional().default([]),
  description: z.string().max(2000).optional().default(''),
});

export const updateProductSchema = createProductSchema.partial();
