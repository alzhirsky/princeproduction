import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});

export const briefSchema = z.object({
  goal: z.string().min(3),
  platform: z.string().min(2),
  format: z.string().min(2),
  deadline: z.string().min(1),
  references: z.array(z.string().url()).default([]),
  notes: z.string().optional()
});

export const createOrderSchema = z.object({
  serviceId: z.string().uuid(),
  buyerId: z.string().uuid(),
  designerId: z.string().uuid().optional(),
  brief: briefSchema,
  attachments: z.array(z.string().url()).max(10).default([])
});

export const designerApplicationSchema = z.object({
  bio: z.string().min(10),
  skills: z.array(z.string()).min(1),
  portfolioLinks: z.array(z.string().url()).min(1),
  portfolioFiles: z.array(z.string().url()).max(10),
  rateNotes: z.string().optional()
});

export const serviceFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  platform: z.string().optional(),
  format: z.string().optional(),
  priceFrom: z.coerce.number().min(0).optional(),
  priceTo: z.coerce.number().min(0).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc']).default('newest')
});

export const chatMessageSchema = z.object({
  orderId: z.string().uuid(),
  senderRole: z.enum(['buyer', 'designer', 'admin']),
  body: z.string().min(1).max(5000),
  attachments: z.array(z.string().url()).max(5).default([])
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type BriefInput = z.infer<typeof briefSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type DesignerApplicationInput = z.infer<typeof designerApplicationSchema>;
export type ServiceFiltersInput = z.infer<typeof serviceFiltersSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
