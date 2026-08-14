import { z } from 'zod';

export const medicineSchema = z.object({
    medicine: z.string().min(1, { message: 'Medicine name is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
});

export type MedicineSchemaType = z.infer<typeof medicineSchema>;
