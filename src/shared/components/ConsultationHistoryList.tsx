// 📦 LIBRARIES IMPORT
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { formatDate } from '../utils/dateUtils';
import type { ConsultationType } from '../data/data.types';

/* ===================================================================== */
/*🧩 CONSULTATION HISTORY LIST - Reusable list of a patient's past consultations*/

interface Props {
    className?: string;
    consultations: ConsultationType[];
    emptyMessage?: string;
}

const ConsultationHistoryList: React.FC<Props> = ({
    className,
    consultations,
    emptyMessage = 'No consultations recorded yet.',
}) => {
    const navigate = useNavigate();

    if (consultations.length === 0) {
        return <p className={twMerge('text-base text-slate-500', className)}>{emptyMessage}</p>;
    }

    return (
        <ul className={twMerge('divide-y divide-blue-50', className)}>
            {consultations.map((consultation) => (
                <li
                    key={consultation.id}
                    onClick={() => navigate(`/consultations/${consultation.id}/edit`)}
                    className="cursor-pointer py-5 transition-colors first:pt-0 last:pb-0 hover:bg-blue-50"
                >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-base font-semibold text-slate-900">
                            {consultation.chiefComplaint}
                        </p>
                        <span className="text-sm font-medium text-slate-400">
                            {formatDate(consultation.consultationDate)}
                        </span>
                    </div>
                    <p className="mt-1.5 text-base text-slate-600">
                        <span className="font-medium text-slate-700">Assessment:</span>{' '}
                        {consultation.assessment}
                    </p>
                    <p className="mt-1 text-base text-slate-600">
                        <span className="font-medium text-slate-700">Plan:</span>{' '}
                        {consultation.plan}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {consultation.vitals.bloodPressure && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                BP {consultation.vitals.bloodPressure}
                            </span>
                        )}
                        {consultation.vitals.heartRate !== undefined && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                HR {consultation.vitals.heartRate} bpm
                            </span>
                        )}
                        {consultation.vitals.temperature !== undefined && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                Temp {consultation.vitals.temperature}°C
                            </span>
                        )}
                        {consultation.vitals.weight !== undefined && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                Weight {consultation.vitals.weight} kg
                            </span>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ConsultationHistoryList;
