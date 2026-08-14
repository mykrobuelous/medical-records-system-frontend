// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../../../shared/components/Modal';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import {
    useCreateInsuranceMutation,
    useUpdateInsuranceMutation,
} from '../../../shared/api/endpoints/insuranceEndpoint';
import { insuranceSchema, type InsuranceSchemaType } from '../schema/insuranceSchema';
import type { InsuranceType } from '../../../shared/data/data.types';

/* ===================================================================== */
/*🧩 INSURANCE FORM MODAL - Create a new insurance provider, or edit an existing one*/

interface Props {
    isOpen: boolean;
    onClose: () => void;
    insurance?: InsuranceType;
}

const IN_InsuranceFormModal: React.FC<Props> = ({ isOpen, onClose, insurance }) => {
    const isEditMode = Boolean(insurance);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InsuranceSchemaType>({
        resolver: zodResolver(insuranceSchema),
        values: insurance ? { insurance: insurance.insurance } : undefined,
    });
    const [createInsurance] = useCreateInsuranceMutation();
    const [updateInsurance] = useUpdateInsuranceMutation();

    const handleClose = () => {
        reset();
        setErrorMessage(null);
        onClose();
    };

    const onSubmit = async (data: InsuranceSchemaType) => {
        try {
            const response = insurance
                ? await updateInsurance({ id: insurance.id, data }).unwrap()
                : await createInsurance(data).unwrap();

            if (response.status === 'error') {
                setErrorMessage(response.message);
                return;
            }
            handleClose();
        } catch {
            setErrorMessage(
                isEditMode
                    ? 'Failed to update insurance. Please try again.'
                    : 'Failed to add insurance. Please try again.'
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditMode ? 'Edit Insurance' : 'Add Insurance'}
        >
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Insurance Name"
                    {...register('insurance')}
                    error={errors.insurance?.message}
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
                                  : 'Add Insurance'
                        }
                        className="w-auto"
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default IN_InsuranceFormModal;
