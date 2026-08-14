// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../../../shared/components/Modal';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import {
    useCreateDiagnosisMutation,
    useUpdateDiagnosisMutation,
} from '../../../shared/api/endpoints/diagnosisEndpoint';
import { diagnosisSchema, type DiagnosisSchemaType } from '../schema/diagnosisSchema';
import type { DiagnosisType } from '../../../shared/data/data.types';

/* ===================================================================== */
/*🧩 DIAGNOSIS FORM MODAL - Create a new diagnosis, or edit an existing one*/

interface Props {
    isOpen: boolean;
    onClose: () => void;
    diagnosis?: DiagnosisType;
}

const CL_DiagnosisFormModal: React.FC<Props> = ({ isOpen, onClose, diagnosis }) => {
    const isEditMode = Boolean(diagnosis);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<DiagnosisSchemaType>({
        resolver: zodResolver(diagnosisSchema),
        values: diagnosis ? { diagnosis: diagnosis.diagnosis } : undefined,
    });
    const [createDiagnosis] = useCreateDiagnosisMutation();
    const [updateDiagnosis] = useUpdateDiagnosisMutation();

    const handleClose = () => {
        reset();
        setErrorMessage(null);
        onClose();
    };

    const onSubmit = async (data: DiagnosisSchemaType) => {
        try {
            const response = diagnosis
                ? await updateDiagnosis({ id: diagnosis.id, data }).unwrap()
                : await createDiagnosis(data).unwrap();

            if (response.status === 'error') {
                setErrorMessage(response.message);
                return;
            }
            handleClose();
        } catch {
            setErrorMessage(
                isEditMode
                    ? 'Failed to update diagnosis. Please try again.'
                    : 'Failed to add diagnosis. Please try again.'
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditMode ? 'Edit Diagnosis' : 'Add Diagnosis'}
        >
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Diagnosis"
                    {...register('diagnosis')}
                    error={errors.diagnosis?.message}
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
                                  : 'Add Diagnosis'
                        }
                        className="w-auto"
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default CL_DiagnosisFormModal;
