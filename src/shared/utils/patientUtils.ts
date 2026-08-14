import type { PatientType } from '../data/data.types';

export const getPatientFullName = (patient: PatientType): string => {
    const givenNames = [patient.firstName, patient.middleName].filter(Boolean).join(' ');
    return `${patient.lastName}, ${givenNames}`;
};
