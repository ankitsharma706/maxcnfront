import { z } from 'zod';

export const calculateGreeksSchema = z.object({
  commodity: z
    .string()
    .min(1, 'Commodity name is required')
    .trim(),
  spotPrice: z
    .number()
    .positive('Spot price must be positive'),
  strike: z
    .number()
    .positive('Strike price must be positive'),
  iv: z
    .number()
    .min(0.01, 'IV must be greater than 0')
    .max(500, 'IV seems unreasonably high'),
  daysToExpiry: z
    .number()
    .positive('Days to expiry must be positive')
    .int('Days to expiry must be a whole number'),
  optionType: z
    .enum(['CALL', 'PUT'], {
      errorMap: () => ({ message: 'Option type must be CALL or PUT' }),
    }),
  riskFreeRate: z
    .number()
    .min(0, 'Risk-free rate cannot be negative')
    .max(1, 'Risk-free rate should be in decimal form (e.g., 0.07)')
    .optional(),
  lots: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1),
});

export const scenarioSchema = z.object({
  commodity: z
    .string()
    .min(1, 'Commodity name is required')
    .trim(),
  spotPrice: z
    .number()
    .positive('Spot price must be positive'),
  strike: z
    .number()
    .positive('Strike price must be positive'),
  iv: z
    .number()
    .min(0.01, 'IV must be greater than 0')
    .max(500, 'IV seems unreasonably high'),
  daysToExpiry: z
    .number()
    .positive('Days to expiry must be positive')
    .int('Days to expiry must be a whole number'),
  optionType: z
    .enum(['CALL', 'PUT']),
  riskFreeRate: z
    .number()
    .min(0)
    .max(1)
    .optional(),
  priceMove: z
    .array(z.number())
    .min(1, 'At least one price move is required')
    .max(20, 'Maximum 20 price moves allowed'),
  lots: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1),
});

export type CalculateGreeksInput = z.infer<typeof calculateGreeksSchema>;
export type ScenarioInput = z.infer<typeof scenarioSchema>;
