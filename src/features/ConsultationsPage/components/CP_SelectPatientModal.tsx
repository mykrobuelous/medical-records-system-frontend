// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { Search } from 'lucide-react';
import Modal from '../../../shared/components/Modal';
import Input from '../../../shared/components/Input';
import { useGetPatientsQuery } from '../../../shared/api/endpoints/patientEndpoint';
import { getPatientFullName } from '../../../shared/utils/patientUtils';
import type { PatientType } from '../../../shared/data/data.types';

/* ===================================================================== */
/*🧩 SELECT PATIENT MODAL - Search and pick a patient for a new consultation*/

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (patient: PatientType) => void;
}

const matchesSearch = (patient: PatientType, term: string): boolean => {
    const haystack = `${getPatientFullName(patient)} ${patient.contactNumber}`.toLowerCase();
    return haystack.includes(term.toLowerCase());
};

const CP_SelectPatientModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
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

    const handleClose = () => {
        setSearchTerm('');
        onClose();
    };

    const handleSelect = (patient: PatientType) => {
        onSelect(patient);
        handleClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Select Patient">
            <div className="flex flex-col gap-4">
                <Input
                    name="patientSearch"
                    Icon={Search}
                    placeholder="Search by name or contact number..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    autoFocus
                />

                {hasLoadError && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        Failed to load patients. Please try refreshing the page.
                    </p>
                )}

                <ul className="max-h-80 divide-y divide-blue-50 overflow-y-auto">
                    {isLoading && (
                        <li className="py-4 text-center text-sm text-slate-500">
                            Loading patients...
                        </li>
                    )}

                    {!isLoading && filteredPatients.length === 0 && (
                        <li className="py-4 text-center text-sm text-slate-500">
                            {searchTerm.trim()
                                ? 'No patients match your search.'
                                : 'No patients yet.'}
                        </li>
                    )}

                    {!isLoading &&
                        filteredPatients.map((patient) => (
                            <li key={patient.id}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(patient)}
                                    className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-blue-50"
                                >
                                    <span className="text-sm font-medium text-slate-900">
                                        {getPatientFullName(patient)}
                                    </span>
                                    <span className="text-sm text-slate-400">
                                        {patient.contactNumber}
                                    </span>
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </Modal>
    );
};

export default CP_SelectPatientModal;
