// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { twMerge } from 'tailwind-merge';
import {
    ArrowLeft,
    Calendar,
    Cake,
    ClipboardPlus,
    Clock,
    Droplet,
    MapPin,
    Pencil,
    Phone,
    Trash2,
    User,
} from 'lucide-react';
import Button from '../../shared/components/Button';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import ConsultationHistoryList from '../../shared/components/ConsultationHistoryList';
import DetailField from '../../shared/components/DetailField';
import AllergyBanner from '../../shared/components/AllergyBanner';
import PP_PatientFormModal from '../PatientsPage/components/PP_PatientFormModal';
import {
    useDeletePatientMutation,
    useGetPatientByIdQuery,
} from '../../shared/api/endpoints/patientEndpoint';
import { useGetConsultationsByPatientIdQuery } from '../../shared/api/endpoints/consultationEndpoint';
import { calculateAge, formatDate } from '../../shared/utils/dateUtils';
import { getPatientFullName } from '../../shared/utils/patientUtils';
import type { IDBrand } from '../../shared/utils/idUtils';

/* ===================================================================== */
/*🧩 PATIENT DETAIL PAGE LAYOUT - Full record for a single patient*/

interface Props {
    className?: string;
}

type DetailTab = 'details' | 'history';

const getInitials = (firstName: string, lastName: string): string =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const PatientDetailPageLayout: React.FC<Props> = ({ className }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const patientId = id as IDBrand;

    const [activeTab, setActiveTab] = useState<DetailTab>('details');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const {
        data: patientResponse,
        isLoading: isPatientLoading,
        isError: isPatientError,
    } = useGetPatientByIdQuery(patientId, { skip: !id });
    const {
        data: consultationsResponse,
        isLoading: isConsultationsLoading,
        isError: isConsultationsError,
    } = useGetConsultationsByPatientIdQuery(patientId, { skip: !id });
    const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();

    const patient = patientResponse?.status === 'ok' ? patientResponse.data : undefined;
    const consultations = consultationsResponse?.status === 'ok' ? consultationsResponse.data : [];

    const isLoading = isPatientLoading || isConsultationsLoading;
    const hasLoadError =
        isPatientError ||
        isConsultationsError ||
        patientResponse?.status === 'error' ||
        consultationsResponse?.status === 'error';

    const sortedConsultations = [...consultations].sort(
        (a, b) => new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime()
    );

    const handleDelete = async () => {
        if (!patient) return;

        try {
            const response = await deletePatient(patient.id).unwrap();
            if (response.status === 'error') {
                setDeleteError(response.message);
                return;
            }
            navigate('/patients');
        } catch {
            setDeleteError('Failed to delete patient. Please try again.');
        }
    };

    return (
        <div className={twMerge('flex h-full min-h-0 flex-col gap-6', className)}>
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/patients')}
                        className="flex w-fit cursor-pointer items-center gap-2 text-base font-medium text-slate-500 transition-colors hover:text-blue-700"
                    >
                        <ArrowLeft size={20} strokeWidth={2} />
                        Back to Patients
                    </button>

                    {patient && (
                        <>
                            <div className="h-6 w-px shrink-0 bg-blue-200" />

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                                {getInitials(patient.firstName, patient.lastName)}
                            </div>

                            <h1 className="text-2xl font-bold text-blue-950">
                                {getPatientFullName(patient)}
                            </h1>
                        </>
                    )}
                </div>

                {patient && (
                    <div className="flex shrink-0 gap-2">
                        <Button
                            label="Add Consultation"
                            Icon={ClipboardPlus}
                            className="w-auto"
                            onClick={() => navigate(`/consultations/new?patientId=${patient.id}`)}
                        />
                        <Button
                            label="Edit"
                            Icon={Pencil}
                            variant="ghost"
                            className="w-auto"
                            onClick={() => setIsEditModalOpen(true)}
                        />
                        <Button
                            label="Delete"
                            Icon={Trash2}
                            variant="ghost"
                            className="w-auto text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => setIsDeleteDialogOpen(true)}
                        />
                    </div>
                )}
            </div>

            {isLoading && <p className="shrink-0 text-base text-slate-500">Loading patient...</p>}

            {!isLoading && (hasLoadError || !patient) && (
                <p className="shrink-0 rounded-lg bg-red-50 px-4 py-3 text-base text-red-600">
                    Failed to load this patient. Please try refreshing the page.
                </p>
            )}

            {deleteError && (
                <p className="shrink-0 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {deleteError}
                </p>
            )}

            {!isLoading && patient && (
                <>
                    <div className="item-shadow flex min-h-0 flex-1 flex-col rounded-2xl border border-blue-100 bg-white p-6">
                        <div className="flex shrink-0 gap-1 border-b border-blue-100">
                            <button
                                type="button"
                                onClick={() => setActiveTab('details')}
                                className={twMerge(
                                    'cursor-pointer border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                                    activeTab === 'details'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-blue-700'
                                )}
                            >
                                Patient Details
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('history')}
                                className={twMerge(
                                    'cursor-pointer border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                                    activeTab === 'history'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-blue-700'
                                )}
                            >
                                Consultation History
                            </button>
                        </div>

                        <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
                            {activeTab === 'details' && (
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        <DetailField
                                            Icon={Cake}
                                            label="Age"
                                            value={`${calculateAge(patient.dateOfBirth)} years old`}
                                        />
                                        <DetailField
                                            Icon={User}
                                            label="Sex"
                                            value={
                                                patient.sex.charAt(0).toUpperCase() +
                                                patient.sex.slice(1)
                                            }
                                        />
                                        <DetailField
                                            Icon={Droplet}
                                            label="Blood Type"
                                            value={
                                                patient.bloodType && patient.bloodType !== 'unknown'
                                                    ? patient.bloodType
                                                    : 'Unknown'
                                            }
                                        />
                                        <DetailField
                                            Icon={Calendar}
                                            label="Date of Birth"
                                            value={formatDate(patient.dateOfBirth)}
                                        />
                                        <DetailField
                                            Icon={Phone}
                                            label="Contact Number"
                                            value={patient.contactNumber}
                                        />
                                        <DetailField
                                            Icon={MapPin}
                                            label="Address"
                                            value={patient.address || '—'}
                                        />
                                        <DetailField
                                            Icon={Clock}
                                            label="Registered On"
                                            value={formatDate(patient.createdAt)}
                                        />
                                        <DetailField
                                            Icon={Clock}
                                            label="Last Updated"
                                            value={formatDate(patient.updatedAt)}
                                        />
                                    </div>

                                    <AllergyBanner allergies={patient.allergies} />
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <ConsultationHistoryList consultations={sortedConsultations} />
                            )}
                        </div>
                    </div>

                    <PP_PatientFormModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        patient={patient}
                    />

                    <ConfirmDialog
                        isOpen={isDeleteDialogOpen}
                        onClose={() => setIsDeleteDialogOpen(false)}
                        onConfirm={handleDelete}
                        title="Delete Patient"
                        description={`Are you sure you want to delete ${getPatientFullName(patient)}? This action cannot be undone.`}
                        confirmLabel="Delete"
                        isConfirming={isDeleting}
                    />
                </>
            )}
        </div>
    );
};

export default PatientDetailPageLayout;
