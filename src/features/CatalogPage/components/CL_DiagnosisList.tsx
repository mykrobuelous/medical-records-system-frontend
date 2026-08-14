// 📦 LIBRARIES IMPORT
import { Pencil, Plus, Stethoscope, Trash2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import Button from '../../../shared/components/Button';
import type { DiagnosisType } from '../../../shared/data/data.types';

/* ===================================================================== */
/*🧩 DIAGNOSIS LIST - Panel listing all diagnoses with edit/delete actions*/

interface Props {
    className?: string;
    diagnoses: DiagnosisType[];
    isLoading?: boolean;
    hasLoadError?: boolean;
    onAdd: () => void;
    onEdit: (diagnosis: DiagnosisType) => void;
    onDelete: (diagnosis: DiagnosisType) => void;
}

const CL_DiagnosisList: React.FC<Props> = ({
    className,
    diagnoses,
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
                    <Stethoscope size={20} strokeWidth={1.8} className="text-blue-600" />
                    <h2 className="text-lg font-semibold text-blue-950">Diagnoses</h2>
                </div>
                <Button label="Add Diagnosis" Icon={Plus} className="w-auto" onClick={onAdd} />
            </div>

            {hasLoadError && (
                <p className="mb-4 shrink-0 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    Failed to load diagnoses. Please try refreshing the page.
                </p>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto">
                {isLoading && <p className="py-4 text-sm text-slate-500">Loading diagnoses...</p>}

                {!isLoading && diagnoses.length === 0 && (
                    <p className="py-4 text-sm text-slate-500">No diagnoses yet.</p>
                )}

                <ul className="divide-y divide-blue-50">
                    {diagnoses.map((diagnosis) => (
                        <li
                            key={diagnosis.id}
                            className="flex items-center justify-between gap-3 py-3"
                        >
                            <p className="min-w-0 truncate text-sm font-medium text-slate-900">
                                {diagnosis.diagnosis}
                            </p>
                            <div className="flex shrink-0 gap-1">
                                <button
                                    type="button"
                                    onClick={() => onEdit(diagnosis)}
                                    aria-label={`Edit ${diagnosis.diagnosis}`}
                                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <Pencil size={16} strokeWidth={1.8} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(diagnosis)}
                                    aria-label={`Delete ${diagnosis.diagnosis}`}
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

export default CL_DiagnosisList;
