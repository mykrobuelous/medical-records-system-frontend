// 📦 LIBRARIES IMPORT
import { Pencil, Pill, Plus, Trash2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import Button from '../../../shared/components/Button';
import type { MedicineType } from '../../../shared/data/data.types';

/* ===================================================================== */
/*🧩 MEDICINE LIST - Panel listing all medicines with edit/delete actions*/

interface Props {
    className?: string;
    medicines: MedicineType[];
    isLoading?: boolean;
    hasLoadError?: boolean;
    onAdd: () => void;
    onEdit: (medicine: MedicineType) => void;
    onDelete: (medicine: MedicineType) => void;
}

const CL_MedicineList: React.FC<Props> = ({
    className,
    medicines,
    isLoading = false,
    hasLoadError = false,
    onAdd,
    onEdit,
    onDelete,
}) => {
    return (
        <div
            className={twMerge(
                'flex h-full min-h-0 flex-col rounded-xl border border-blue-100 bg-white p-5',
                className
            )}
        >
            <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Pill size={20} strokeWidth={1.8} className="text-blue-600" />
                    <h2 className="text-lg font-semibold text-blue-950">Medicines</h2>
                </div>
                <Button label="Add Medicine" Icon={Plus} className="w-auto" onClick={onAdd} />
            </div>

            {hasLoadError && (
                <p className="mb-4 shrink-0 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    Failed to load medicines. Please try refreshing the page.
                </p>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto">
                {isLoading && <p className="py-4 text-sm text-slate-500">Loading medicines...</p>}

                {!isLoading && medicines.length === 0 && (
                    <p className="py-4 text-sm text-slate-500">No medicines yet.</p>
                )}

                <ul className="divide-y divide-blue-50">
                    {medicines.map((medicine) => (
                        <li
                            key={medicine.id}
                            className="flex items-center justify-between gap-3 py-3"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-900">
                                    {medicine.medicine}
                                </p>
                                <p className="truncate text-sm text-slate-500">
                                    {medicine.description}
                                </p>
                            </div>
                            <div className="flex shrink-0 gap-1">
                                <button
                                    type="button"
                                    onClick={() => onEdit(medicine)}
                                    aria-label={`Edit ${medicine.medicine}`}
                                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <Pencil size={16} strokeWidth={1.8} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(medicine)}
                                    aria-label={`Delete ${medicine.medicine}`}
                                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 size={16} strokeWidth={1.8} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CL_MedicineList;
