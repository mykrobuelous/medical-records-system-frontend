// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import CL_MedicineList from './components/CL_MedicineList';
import CL_DiagnosisList from './components/CL_DiagnosisList';
import CL_MedicineFormModal from './components/CL_MedicineFormModal';
import CL_DiagnosisFormModal from './components/CL_DiagnosisFormModal';
import {
    useDeleteMedicineMutation,
    useGetMedicinesQuery,
} from '../../shared/api/endpoints/medicineEndpoint';
import {
    useDeleteDiagnosisMutation,
    useGetDiagnosesQuery,
} from '../../shared/api/endpoints/diagnosisEndpoint';
import type { DiagnosisType, MedicineType } from '../../shared/data/data.types';

/* ===================================================================== */
/*🧩 CATALOG PAGE LAYOUT - Manage the shared medicine and diagnosis catalogs*/

interface Props {
    className?: string;
}

const CatalogPageLayout: React.FC<Props> = ({ className }) => {
    const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState<MedicineType | undefined>(undefined);
    const [deletingMedicine, setDeletingMedicine] = useState<MedicineType | undefined>(undefined);
    const [medicineDeleteError, setMedicineDeleteError] = useState<string | null>(null);

    const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
    const [editingDiagnosis, setEditingDiagnosis] = useState<DiagnosisType | undefined>(undefined);
    const [deletingDiagnosis, setDeletingDiagnosis] = useState<DiagnosisType | undefined>(
        undefined
    );
    const [diagnosisDeleteError, setDiagnosisDeleteError] = useState<string | null>(null);

    const {
        data: medicinesResponse,
        isLoading: isMedicinesLoading,
        isError: isMedicinesError,
    } = useGetMedicinesQuery();
    const {
        data: diagnosesResponse,
        isLoading: isDiagnosesLoading,
        isError: isDiagnosesError,
    } = useGetDiagnosesQuery();
    const [deleteMedicine, { isLoading: isDeletingMedicine }] = useDeleteMedicineMutation();
    const [deleteDiagnosis, { isLoading: isDeletingDiagnosis }] = useDeleteDiagnosisMutation();

    const medicines = medicinesResponse?.status === 'ok' ? medicinesResponse.data : [];
    const diagnoses = diagnosesResponse?.status === 'ok' ? diagnosesResponse.data : [];

    const openAddMedicine = () => {
        setEditingMedicine(undefined);
        setIsMedicineModalOpen(true);
    };
    const closeMedicineModal = () => {
        setIsMedicineModalOpen(false);
        setEditingMedicine(undefined);
    };
    const handleDeleteMedicine = async () => {
        if (!deletingMedicine) return;

        try {
            const response = await deleteMedicine(deletingMedicine.id).unwrap();
            if (response.status === 'error') {
                setMedicineDeleteError(response.message);
                setDeletingMedicine(undefined);
                return;
            }
            setDeletingMedicine(undefined);
            setMedicineDeleteError(null);
        } catch {
            setMedicineDeleteError('Failed to delete medicine. Please try again.');
            setDeletingMedicine(undefined);
        }
    };

    const openAddDiagnosis = () => {
        setEditingDiagnosis(undefined);
        setIsDiagnosisModalOpen(true);
    };
    const closeDiagnosisModal = () => {
        setIsDiagnosisModalOpen(false);
        setEditingDiagnosis(undefined);
    };
    const handleDeleteDiagnosis = async () => {
        if (!deletingDiagnosis) return;

        try {
            const response = await deleteDiagnosis(deletingDiagnosis.id).unwrap();
            if (response.status === 'error') {
                setDiagnosisDeleteError(response.message);
                setDeletingDiagnosis(undefined);
                return;
            }
            setDeletingDiagnosis(undefined);
            setDiagnosisDeleteError(null);
        } catch {
            setDiagnosisDeleteError('Failed to delete diagnosis. Please try again.');
            setDeletingDiagnosis(undefined);
        }
    };

    return (
        <div className={twMerge('flex h-full min-h-0 flex-col gap-4', className)}>
            <div>
                <h1 className="text-2xl font-bold text-blue-950">Catalog</h1>
                <p className="text-sm text-slate-500">
                    Manage the shared medicine and diagnosis lists
                </p>
            </div>

            {medicineDeleteError && (
                <p className="shrink-0 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {medicineDeleteError}
                </p>
            )}
            {diagnosisDeleteError && (
                <p className="shrink-0 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {diagnosisDeleteError}
                </p>
            )}

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
                <CL_MedicineList
                    medicines={medicines}
                    isLoading={isMedicinesLoading}
                    hasLoadError={isMedicinesError || medicinesResponse?.status === 'error'}
                    onAdd={openAddMedicine}
                    onEdit={(medicine) => {
                        setEditingMedicine(medicine);
                        setIsMedicineModalOpen(true);
                    }}
                    onDelete={setDeletingMedicine}
                />
                <CL_DiagnosisList
                    diagnoses={diagnoses}
                    isLoading={isDiagnosesLoading}
                    hasLoadError={isDiagnosesError || diagnosesResponse?.status === 'error'}
                    onAdd={openAddDiagnosis}
                    onEdit={(diagnosis) => {
                        setEditingDiagnosis(diagnosis);
                        setIsDiagnosisModalOpen(true);
                    }}
                    onDelete={setDeletingDiagnosis}
                />
            </div>

            <CL_MedicineFormModal
                isOpen={isMedicineModalOpen}
                onClose={closeMedicineModal}
                medicine={editingMedicine}
            />
            <ConfirmDialog
                isOpen={Boolean(deletingMedicine)}
                onClose={() => setDeletingMedicine(undefined)}
                onConfirm={handleDeleteMedicine}
                title="Delete Medicine"
                description={`Are you sure you want to delete "${deletingMedicine?.medicine}"? This action cannot be undone.`}
                confirmLabel="Delete"
                isConfirming={isDeletingMedicine}
            />

            <CL_DiagnosisFormModal
                isOpen={isDiagnosisModalOpen}
                onClose={closeDiagnosisModal}
                diagnosis={editingDiagnosis}
            />
            <ConfirmDialog
                isOpen={Boolean(deletingDiagnosis)}
                onClose={() => setDeletingDiagnosis(undefined)}
                onConfirm={handleDeleteDiagnosis}
                title="Delete Diagnosis"
                description={`Are you sure you want to delete "${deletingDiagnosis?.diagnosis}"? This action cannot be undone.`}
                confirmLabel="Delete"
                isConfirming={isDeletingDiagnosis}
            />
        </div>
    );
};

export default CatalogPageLayout;
