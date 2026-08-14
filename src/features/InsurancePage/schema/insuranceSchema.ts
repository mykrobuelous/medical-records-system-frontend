import { z } from 'zod';

export const insuranceSchema = z.object({
    insurance: z.string().min(1, { message: 'Insurance name is required' }),
});

export type InsuranceSchemaType = z.infer<typeof insuranceSchema>;
