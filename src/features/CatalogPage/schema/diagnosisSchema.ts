import { z } from 'zod';

export const diagnosisSchema = z.object({
    diagnosis: z.string().min(1, { message: 'Diagnosis is required' }),
});

export type DiagnosisSchemaType = z.infer<typeof diagnosisSchema>;
