// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { Plus, Search } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { useGetConsultationsQuery } from '../../shared/api/endpoints/consultationEndpoint';
import { useGetPatientsQuery } from '../../shared/api/endpoints/patientEndpoint';
import { formatAgeAtDate, formatDate, isWithinDateRange } from '../../shared/utils/dateUtils';
import { getPatientFullName } from '../../shared/utils/patientUtils';
import type { ConsultationType, PatientType } from '../../shared/data/data.types';
import type { IDBrand } from '../../shared/utils/idUtils';

/* ===================================================================== */
/*🧩 CONSULTATIONS PAGE LAYOUT - Where all the list of consultations are*/

interface Props {
    className?: string;
}

const ConsultationsPageLayout: React.FC<Props> = ({ className }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const {
        data: consultationsResponse,
        isLoading: isConsultationsLoading,
        isError: isConsultationsError,
    } = useGetConsultationsQuery();
    const {
        data: patientsResponse,
        isLoading: isPatientsLoading,
        isError: isPatientsError,
    } = useGetPatientsQuery();

    const consultations = consultationsResponse?.status === 'ok' ? consultationsResponse.data : [];
    const patients = patientsResponse?.status === 'ok' ? patientsResponse.data : [];

    const isLoading = isConsultationsLoading || isPatientsLoading;
    const hasLoadError =
        isConsultationsError ||
        isPatientsError ||
        consultationsResponse?.status === 'error' ||
        patientsResponse?.status === 'error';

    const patientById = new Map<IDBrand, PatientType>(
        patients.map((patient) => [patient.id, patient])
    );

    const sortedConsultations = [...consultations].sort(
        (a, b) => new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime()
    );

    const filteredConsultations = sortedConsultations.filter((consultation: ConsultationType) => {
        if (!isWithinDateRange(consultation.consultationDate, fromDate, toDate)) return false;

        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;

        const patient = patientById.get(consultation.patientId);
        const patientName = patient ? getPatientFullName(patient) : '';
        return patientName.toLowerCase().includes(term);
    });

    return (
        <div className={twMerge('flex h-full min-h-0 flex-col gap-6', className)}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-blue-950">Consultations</h1>
                    <p className="text-sm text-slate-500">Patient visit records</p>
                </div>

                <Button
                    label="Add Consultation"
                    Icon={Plus}
                    className="w-auto"
                    onClick={() => navigate('/consultations/new')}
                />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Input
                    name="search"
                    Icon={Search}
                    placeholder="Search by patient name..."
                    className="min-w-0 flex-1"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />

                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-slate-600">From</span>
                    <Input
                        name="fromDate"
                        type="date"
                        aria-label="From date"
                        value={fromDate}
                        onChange={(event) => setFromDate(event.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-slate-600">To</span>
                    <Input
                        name="toDate"
                        type="date"
                        aria-label="To date"
                        value={toDate}
                        onChange={(event) => setToDate(event.target.value)}
                    />
                </div>
            </div>

            {hasLoadError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    Failed to load consultations. Please try refreshing the page.
                </p>
            )}

            <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-blue-100 bg-white">
                <table className="w-full text-left">
                    <thead className="sticky top-0 z-10 border-b border-blue-100 bg-blue-50">
                        <tr>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">
                                Patient
                            </th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">Age</th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">Date</th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">
                                Chief Complaint
                            </th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">
                                Assessment
                            </th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">Plan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50">
                        {isLoading && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-sm text-slate-500"
                                >
                                    Loading consultations...
                                </td>
                            </tr>
                        )}

                        {!isLoading && filteredConsultations.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-sm text-slate-500"
                                >
                                    {searchTerm.trim() || fromDate || toDate
                                        ? 'No consultations match your filters.'
                                        : 'No consultations yet.'}
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            filteredConsultations.map((consultation) => {
                                const patient = patientById.get(consultation.patientId);

                                return (
                                    <tr
                                        key={consultation.id}
                                        onClick={() =>
                                            navigate(`/consultations/${consultation.id}/edit`)
                                        }
                                        className="cursor-pointer hover:bg-blue-50"
                                    >
                                        <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-slate-900">
                                            {patient
                                                ? getPatientFullName(patient)
                                                : 'Unknown patient'}
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-600">
                                            {patient
                                                ? formatAgeAtDate(
                                                      patient.dateOfBirth,
                                                      consultation.consultationDate
                                                  )
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-600">
                                            {formatDate(consultation.consultationDate)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {consultation.chiefComplaint}
                                        </td>
                                        <td className="max-w-xs px-4 py-3 text-sm text-slate-600">
                                            {consultation.assessment}
                                        </td>
                                        <td className="max-w-xs px-4 py-3 text-sm text-slate-600">
                                            {consultation.plan}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConsultationsPageLayout;
