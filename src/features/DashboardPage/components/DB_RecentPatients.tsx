// 📦 LIBRARIES IMPORT
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';
import type { PatientType } from '../../../shared/data/data.types';
import { formatDate } from '../../../shared/utils/dateUtils';

/* ===================================================================== */
/* 🧩 RECENT PATIENTS - Most recently registered patients */

interface Props {
    className?: string;
    patients: PatientType[];
    isLoading?: boolean;
}

const DB_RecentPatients: React.FC<Props> = ({ className, patients, isLoading = false }) => {
    const navigate = useNavigate();

    return (
        <div
            className={twMerge(
                'flex h-full min-h-0 flex-col rounded-xl border border-blue-100 bg-white p-4',
                className
            )}
        >
            <h2 className="mb-2 shrink-0 text-base font-semibold text-blue-950">
                Recently Added Patients
            </h2>

            <div className="min-h-0 flex-1 overflow-y-auto">
                {isLoading && <p className="py-4 text-sm text-slate-500">Loading...</p>}

                {!isLoading && patients.length === 0 && (
                    <p className="py-4 text-sm text-slate-500">No patients yet.</p>
                )}

                <ul className="divide-y divide-blue-50">
                    {patients.map((patient) => (
                        <li
                            key={patient.id}
                            onClick={() => navigate(`/patients/${patient.id}`)}
                            className="flex cursor-pointer items-center justify-between py-2.5 transition-colors hover:bg-blue-50"
                        >
                            <div>
                                <p className="text-sm font-medium text-slate-900">
                                    {patient.firstName} {patient.lastName}
                                </p>
                                <p className="text-sm text-slate-500">{patient.contactNumber}</p>
                            </div>
                            <span className="text-xs font-medium whitespace-nowrap text-slate-400">
                                {formatDate(patient.createdAt)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DB_RecentPatients;
