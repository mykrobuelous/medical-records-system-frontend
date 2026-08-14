// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { Search } from 'lucide-react';
import Modal from '../../../shared/components/Modal';
import Input from '../../../shared/components/Input';
import { useGetMedicinesQuery } from '../../../shared/api/endpoints/medicineEndpoint';
import type { MedicineType } from '../../../shared/data/data.types';

/* ===================================================================== */
/*🧩 SELECT MEDICINE MODAL - Search and pick a medicine to add to the plan*/

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (medicine: MedicineType) => void;
}

const matchesSearch = (medicine: MedicineType, term: string): boolean =>
    `${medicine.medicine} ${medicine.description}`.toLowerCase().includes(term.toLowerCase());

const CP_SelectMedicineModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: medicinesResponse, isLoading, isError } = useGetMedicinesQuery();

    const medicines = medicinesResponse?.status === 'ok' ? medicinesResponse.data : [];
    const hasLoadError = isError || medicinesResponse?.status === 'error';

    const filteredMedicines = searchTerm.trim()
        ? medicines.filter((medicine) => matchesSearch(medicine, searchTerm))
        : medicines;

    const handleClose = () => {
        setSearchTerm('');
        onClose();
    };

    const handleSelect = (medicine: MedicineType) => {
        onSelect(medicine);
        handleClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Select Medicine">
            <div className="flex flex-col gap-4">
                <Input
                    name="medicineSearch"
                    Icon={Search}
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    autoFocus
                />

                {hasLoadError && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        Failed to load medicines. Please try refreshing the page.
                    </p>
                )}

                <ul className="max-h-80 divide-y divide-blue-50 overflow-y-auto">
                    {isLoading && (
                        <li className="py-4 text-center text-sm text-slate-500">
                            Loading medicines...
                        </li>
                    )}

                    {!isLoading && filteredMedicines.length === 0 && (
                        <li className="py-4 text-center text-sm text-slate-500">
                            {searchTerm.trim()
                                ? 'No medicines match your search.'
                                : 'No medicines yet.'}
                        </li>
                    )}

                    {!isLoading &&
                        filteredMedicines.map((medicine) => (
                            <li key={medicine.id}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(medicine)}
                                    className="flex w-full cursor-pointer flex-col items-start rounded-lg px-3 py-3 text-left transition-colors hover:bg-blue-50"
                                >
                                    <span className="text-sm font-medium text-slate-900">
                                        {medicine.medicine}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        {medicine.description}
                                    </span>
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </Modal>
    );
};

export default CP_SelectMedicineModal;
