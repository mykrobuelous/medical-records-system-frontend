import { z } from 'zod';

export const patientSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
    sex: z.enum(['male', 'female']),
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']).optional(),
    contactNumber: z.string().min(1, { message: 'Contact number is required' }),
    address: z.string().optional(),
    allergies: z.string().optional(),
});

export type PatientSchemaType = z.infer<typeof patientSchema>;
