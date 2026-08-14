// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../../../shared/components/Modal';
import Input from '../../../shared/components/Input';
import Textarea from '../../../shared/components/Textarea';
import Button from '../../../shared/components/Button';
import {
    useCreateMedicineMutation,
    useUpdateMedicineMutation,
} from '../../../shared/api/endpoints/medicineEndpoint';
import { medicineSchema, type MedicineSchemaType } from '../schema/medicineSchema';
import type { MedicineType } from '../../../shared/data/data.types';

/* ===================================================================== */
/*🧩 MEDICINE FORM MODAL - Create a new medicine, or edit an existing one*/

interface Props {
    isOpen: boolean;
    onClose: () => void;
    medicine?: MedicineType;
}

const CL_MedicineFormModal: React.FC<Props> = ({ isOpen, onClose, medicine }) => {
    const isEditMode = Boolean(medicine);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<MedicineSchemaType>({
        resolver: zodResolver(medicineSchema),
        values: medicine
            ? {
                  medicine: medicine.medicine,
                  description: medicine.description,
              }
            : undefined,
    });
    const [createMedicine] = useCreateMedicineMutation();
    const [updateMedicine] = useUpdateMedicineMutation();

    const handleClose = () => {
        reset();
        setErrorMessage(null);
        onClose();
    };

    const onSubmit = async (data: MedicineSchemaType) => {
        try {
            const response = medicine
                ? await updateMedicine({ id: medicine.id, data }).unwrap()
                : await createMedicine(data).unwrap();

            if (response.status === 'error') {
                setErrorMessage(response.message);
                return;
            }
            handleClose();
        } catch {
            setErrorMessage(
                isEditMode
                    ? 'Failed to update medicine. Please try again.'
                    : 'Failed to add medicine. Please try again.'
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditMode ? 'Edit Medicine' : 'Add Medicine'}
        >
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Medicine Name"
                    {...register('medicine')}
                    error={errors.medicine?.message}
                />
                <Textarea
                    label="Description"
                    {...register('description')}
                    error={errors.description?.message}
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
                                  : 'Add Medicine'
                        }
                        className="w-auto"
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default CL_MedicineFormModal;
