// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { Plus, Search } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { useGetPatientsQuery } from '../../shared/api/endpoints/patientEndpoint';
import { calculateAge, formatDate } from '../../shared/utils/dateUtils';
import { getPatientFullName } from '../../shared/utils/patientUtils';
import PP_PatientFormModal from './components/PP_PatientFormModal';
import type { PatientType } from '../../shared/data/data.types';

/* ===================================================================== */
/*🧩 PATIENT PAGE - List of patients*/

interface Props {
    className?: string;
}

const matchesSearch = (patient: PatientType, term: string): boolean => {
    const haystack = `${getPatientFullName(patient)} ${patient.contactNumber}`.toLowerCase();
    return haystack.includes(term.toLowerCase());
};

const PatientsPageLayout: React.FC<Props> = ({ className }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const navigate = useNavigate();
    const { data: patientsResponse, isLoading, isError } = useGetPatientsQuery();

    const patients = patientsResponse?.status === 'ok' ? patientsResponse.data : [];
    const hasLoadError = isError || patientsResponse?.status === 'error';

    const sortedPatients = [...patients].sort((a, b) => {
        const lastNameComparison = a.lastName.localeCompare(b.lastName);
        return lastNameComparison !== 0
            ? lastNameComparison
            : a.firstName.localeCompare(b.firstName);
    });

    const filteredPatients = searchTerm.trim()
        ? sortedPatients.filter((patient) => matchesSearch(patient, searchTerm))
        : sortedPatients;

    return (
        <div className={twMerge('flex h-full min-h-0 flex-col gap-6', className)}>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950">Patients</h1>
                    <p className="text-sm text-slate-500">Browse and search patient records</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="w-full max-w-sm sm:w-64">
                        <Input
                            name="search"
                            Icon={Search}
                            placeholder="Search by name or contact number..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>

                    <Button
                        label="Add Patient"
                        Icon={Plus}
                        className="w-auto"
                        onClick={() => setIsAddModalOpen(true)}
                    />
                </div>
            </div>

            {hasLoadError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    Failed to load patients. Please try refreshing the page.
                </p>
            )}

            <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-blue-100 bg-white">
                <table className="w-full text-left">
                    <thead className="sticky top-0 z-10 border-b border-blue-100 bg-blue-50">
                        <tr>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">Name</th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">Age</th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">
                                Date of Birth
                            </th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">Sex</th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">
                                Blood Type
                            </th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">
                                Contact Number
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50">
                        {isLoading && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-sm text-slate-500"
                                >
                                    Loading patients...
                                </td>
                            </tr>
                        )}

                        {!isLoading && filteredPatients.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-sm text-slate-500"
                                >
                                    {searchTerm.trim()
                                        ? 'No patients match your search.'
                                        : 'No patients yet.'}
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            filteredPatients.map((patient) => (
                                <tr
                                    key={patient.id}
                                    onClick={() => navigate(`/patients/${patient.id}`)}
                                    className="cursor-pointer hover:bg-blue-50"
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                        {getPatientFullName(patient)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {calculateAge(patient.dateOfBirth)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {formatDate(patient.dateOfBirth)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                                        {patient.sex}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {patient.bloodType && patient.bloodType !== 'unknown'
                                            ? patient.bloodType
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {patient.contactNumber}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <PP_PatientFormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
};

export default PatientsPageLayout;
