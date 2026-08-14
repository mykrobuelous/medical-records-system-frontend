// 📦 LIBRARIES IMPORT
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';
import type { ConsultationType } from '../../../shared/data/data.types';
import type { IDBrand } from '../../../shared/utils/idUtils';
import { formatDate } from '../../../shared/utils/dateUtils';

/* ===================================================================== */
/* 🧩 RECENT CONSULTATIONS - Latest consultations across all patients */

interface Props {
    className?: string;
    consultations: ConsultationType[];
    patientNameById: Map<IDBrand, string>;
    isLoading?: boolean;
}

const DB_RecentConsultations: React.FC<Props> = ({
    className,
    consultations,
    patientNameById,
    isLoading = false,
}) => {
    const navigate = useNavigate();

    return (
        <div
            className={twMerge(
                'flex h-full min-h-0 flex-col rounded-xl border border-blue-100 bg-white p-5',
                className
            )}
        >
            <h2 className="mb-2 shrink-0 text-lg font-semibold text-blue-950">
                Recent Consultations
            </h2>

            <div className="min-h-0 flex-1 overflow-y-auto">
                {isLoading && <p className="py-4 text-sm text-slate-500">Loading...</p>}

                {!isLoading && consultations.length === 0 && (
                    <p className="py-4 text-sm text-slate-500">No consultations yet.</p>
                )}

                <ul className="divide-y divide-blue-50">
                    {consultations.map((consultation) => (
                        <li
                            key={consultation.id}
                            onClick={() => navigate(`/consultations/${consultation.id}/edit`)}
                            className="flex cursor-pointer items-center justify-between py-3 transition-colors hover:bg-blue-50"
                        >
                            <div>
                                <p className="text-sm font-medium text-slate-900">
                                    {patientNameById.get(consultation.patientId) ??
                                        'Unknown patient'}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {consultation.chiefComplaint}
                                </p>
                            </div>
                            <span className="text-xs font-medium whitespace-nowrap text-slate-400">
                                {formatDate(consultation.consultationDate)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DB_RecentConsultations;
