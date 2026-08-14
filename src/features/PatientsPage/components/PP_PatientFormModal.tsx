// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../../../shared/components/Modal';
import Input from '../../../shared/components/Input';
import Select from '../../../shared/components/Select';
import Button from '../../../shared/components/Button';
import {
    useCreatePatientMutation,
    useUpdatePatientMutation,
} from '../../../shared/api/endpoints/patientEndpoint';
import { patientSchema, type PatientSchemaType } from '../schema/patientSchema';
import type { PatientType } from '../../../shared/data/data.types';

/* ===================================================================== */
/*🧩 PATIENT FORM MODAL - Create a new patient, or edit an existing one*/

interface Props {
    isOpen: boolean;
    onClose: () => void;
    patient?: PatientType;
}

const PP_PatientFormModal: React.FC<Props> = ({ isOpen, onClose, patient }) => {
    const isEditMode = Boolean(patient);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PatientSchemaType>({
        resolver: zodResolver(patientSchema),
        values: patient
            ? {
                  firstName: patient.firstName,
                  middleName: patient.middleName ?? '',
                  lastName: patient.lastName,
                  dateOfBirth: patient.dateOfBirth,
                  sex: patient.sex,
                  bloodType: patient.bloodType ?? 'unknown',
                  contactNumber: patient.contactNumber,
                  address: patient.address ?? '',
                  allergies: patient.allergies ?? '',
              }
            : undefined,
    });
    const [createPatient] = useCreatePatientMutation();
    const [updatePatient] = useUpdatePatientMutation();

    const handleClose = () => {
        reset();
        setErrorMessage(null);
        onClose();
    };

    const onSubmit = async (data: PatientSchemaType) => {
        try {
            const response = patient
                ? await updatePatient({ id: patient.id, data }).unwrap()
                : await createPatient(data).unwrap();

            if (response.status === 'error') {
                setErrorMessage(response.message);
                return;
            }
            handleClose();
        } catch {
            setErrorMessage(
                isEditMode
                    ? 'Failed to update patient. Please try again.'
                    : 'Failed to add patient. Please try again.'
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditMode ? 'Edit Patient' : 'Add Patient'}
        >
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                        label="First Name"
                        {...register('firstName')}
                        error={errors.firstName?.message}
                    />
                    <Input
                        label="Middle Name"
                        {...register('middleName')}
                        error={errors.middleName?.message}
                    />
                </div>

                <Input
                    label="Last Name"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                        label="Date of Birth"
                        type="date"
                        {...register('dateOfBirth')}
                        error={errors.dateOfBirth?.message}
                    />
                    <Select label="Sex" {...register('sex')} error={errors.sex?.message}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </Select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Select
                        label="Blood Type"
                        {...register('bloodType')}
                        error={errors.bloodType?.message}
                    >
                        <option value="unknown">Unknown</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </Select>
                    <Input
                        label="Contact Number"
                        {...register('contactNumber')}
                        error={errors.contactNumber?.message}
                    />
                </div>

                <Input label="Address" {...register('address')} error={errors.address?.message} />
                <Input
                    label="Allergies"
                    placeholder="e.g. Penicillin, Shellfish"
                    {...register('allergies')}
                    error={errors.allergies?.message}
                />

                {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        label="Cancel"
                        variant="ghost"
                        className="w-auto"
                        onClick={handleClose}
                    />
                    <Button
                        type="submit"
                        label={
                            isSubmitting
                                ? isEditMode
                                    ? 'Saving...'
                                    : 'Adding...'
                                : isEditMode
                                  ? 'Save Changes'
                                  : 'Add Patient'
                        }
                        className="w-auto"
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default PP_PatientFormModal;
