import { z } from 'zod';

export const manualPriceSchema = z.object({
  commodity: z
    .string()
    .min(1, 'Commodity name is required')
    .trim()
    .default('Gold Mini'),
  price: z
    .number()
    .positive('Price must be positive'),
  open: z
    .number()
    .positive()
    .optional(),
  high: z
    .number()
    .positive()
    .optional(),
  low: z
    .number()
    .positive()
    .optional(),
  close: z
    .number()
    .positive()
    .optional(),
  source: z
    .enum(['manual', 'ocr', 'api'])
    .default('manual'),
});

export type ManualPriceInput = z.infer<typeof manualPriceSchema>;
