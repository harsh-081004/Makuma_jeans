import { z } from 'zod';

export const createInquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  business: z.string().min(1, 'Business name is required').max(200),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
  phone: z.string().max(20).optional().default(''),
  interest: z.string().max(200).optional().default(''),
  volume: z.string().max(100).optional().default(''),
  message: z.string().max(2000).optional().default(''),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'closed']),
});
