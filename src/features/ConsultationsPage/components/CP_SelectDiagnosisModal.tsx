// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { Search } from 'lucide-react';
import Modal from '../../../shared/components/Modal';
import Input from '../../../shared/components/Input';
import { useGetDiagnosesQuery } from '../../../shared/api/endpoints/diagnosisEndpoint';
import type { DiagnosisType } from '../../../shared/data/data.types';

/* ===================================================================== */
/*🧩 SELECT DIAGNOSIS MODAL - Search and pick a diagnosis to add to the assessment*/

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (diagnosis: DiagnosisType) => void;
}

const matchesSearch = (diagnosis: DiagnosisType, term: string): boolean =>
    diagnosis.diagnosis.toLowerCase().includes(term.toLowerCase());

const CP_SelectDiagnosisModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: diagnosesResponse, isLoading, isError } = useGetDiagnosesQuery();

    const diagnoses = diagnosesResponse?.status === 'ok' ? diagnosesResponse.data : [];
    const hasLoadError = isError || diagnosesResponse?.status === 'error';

    const filteredDiagnoses = searchTerm.trim()
        ? diagnoses.filter((diagnosis) => matchesSearch(diagnosis, searchTerm))
        : diagnoses;

    const handleClose = () => {
        setSearchTerm('');
        onClose();
    };

    const handleSelect = (diagnosis: DiagnosisType) => {
        onSelect(diagnosis);
        handleClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Select Diagnosis">
            <div className="flex flex-col gap-4">
                <Input
                    name="diagnosisSearch"
                    Icon={Search}
                    placeholder="Search diagnoses..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    autoFocus
                />

                {hasLoadError && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        Failed to load diagnoses. Please try refreshing the page.
                    </p>
                )}

                <ul className="max-h-80 divide-y divide-blue-50 overflow-y-auto">
                    {isLoading && (
                        <li className="py-4 text-center text-sm text-slate-500">
                            Loading diagnoses...
                        </li>
                    )}

                    {!isLoading && filteredDiagnoses.length === 0 && (
                        <li className="py-4 text-center text-sm text-slate-500">
                            {searchTerm.trim()
                                ? 'No diagnoses match your search.'
                                : 'No diagnoses yet.'}
                        </li>
                    )}

                    {!isLoading &&
                        filteredDiagnoses.map((diagnosis) => (
                            <li key={diagnosis.id}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(diagnosis)}
                                    className="flex w-full cursor-pointer items-center rounded-lg px-3 py-3 text-left transition-colors hover:bg-blue-50"
                                >
                                    <span className="text-sm font-medium text-slate-900">
                                        {diagnosis.diagnosis}
                                    </span>
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </Modal>
    );
};

export default CP_SelectDiagnosisModal;
