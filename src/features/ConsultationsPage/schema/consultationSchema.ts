import { z } from 'zod';

const optionalNumber = z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined));

const requiredNumber = z
    .string()
    .min(1, { message: 'This field is required' })
    .transform((val) => Number(val));

export const consultationSchema = z.object({
    patientId: z.string().min(1, { message: 'Please select a patient' }),
    consultationDate: z.string().min(1, { message: 'Consultation date is required' }),
    chiefComplaint: z.string().min(1, { message: 'Chief complaint is required' }),
    subjective: z.string().min(1, { message: 'Subjective is required' }),
    objective: z.string().min(1, { message: 'Objective is required' }),
    assessment: z.string().min(1, { message: 'Assessment is required' }),
    plan: z.string().min(1, { message: 'Plan is required' }),
    vitals: z.object({
        height: optionalNumber,
        weight: optionalNumber,
        temperature: optionalNumber,
    }),
    insurance: z.string().min(1, { message: 'Please select insurance or Personal' }),
    payment: requiredNumber,
});

// The form holds raw string inputs (e.g. an empty vitals field is "", not undefined);
// submitting resolves them to the transformed/coerced shape sent to the API.
export type ConsultationFormValues = z.input<typeof consultationSchema>;
export type ConsultationSchemaType = z.output<typeof consultationSchema>;
