// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { twMerge } from 'tailwind-merge';
import {
    ArrowLeft,
    Calendar,
    Cake,
    ChevronDown,
    Droplet,
    MapPin,
    Phone,
    Pill,
    Stethoscope,
    Trash2,
    User,
} from 'lucide-react';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';
import Textarea from '../../shared/components/Textarea';
import Button from '../../shared/components/Button';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import ConsultationHistoryList from '../../shared/components/ConsultationHistoryList';
import DetailField from '../../shared/components/DetailField';
import AllergyBanner from '../../shared/components/AllergyBanner';
import CP_SelectPatientModal from './components/CP_SelectPatientModal';
import CP_SelectDiagnosisModal from './components/CP_SelectDiagnosisModal';
import CP_SelectMedicineModal from './components/CP_SelectMedicineModal';
import { useGetPatientsQuery } from '../../shared/api/endpoints/patientEndpoint';
import { useGetInsurancesQuery } from '../../shared/api/endpoints/insuranceEndpoint';
import {
    useCreateConsultationMutation,
    useDeleteConsultationMutation,
    useGetConsultationByIdQuery,
    useGetConsultationsByPatientIdQuery,
    useUpdateConsultationMutation,
} from '../../shared/api/endpoints/consultationEndpoint';
import { calculateAge, formatDate } from '../../shared/utils/dateUtils';
import { getPatientFullName } from '../../shared/utils/patientUtils';
import {
    consultationSchema,
    type ConsultationFormValues,
    type ConsultationSchemaType,
} from './schema/consultationSchema';
import type { IDBrand } from '../../shared/utils/idUtils';
import type { DiagnosisType, MedicineType } from '../../shared/data/data.types';

/* ===================================================================== */
/*🧩 CONSULTATION FORM PAGE LAYOUT - Record a new consultation, or edit an existing one*/

interface Props {
    className?: string;
}

type SidebarTab = 'history' | 'info';

const ConsultationFormPageLayout: React.FC<Props> = ({ className }) => {
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialPatientId = searchParams.get('patientId') ?? '';
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<SidebarTab>('history');
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
    const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const {
        data: consultationResponse,
        isLoading: isConsultationLoading,
        isError: isConsultationError,
    } = useGetConsultationByIdQuery(id as IDBrand, { skip: !id });
    const consultation =
        consultationResponse?.status === 'ok' ? consultationResponse.data : undefined;
    const isConsultationUnavailable =
        isEditMode &&
        (isConsultationLoading ||
            isConsultationError ||
            consultationResponse?.status === 'error' ||
            !consultation);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<ConsultationFormValues, unknown, ConsultationSchemaType>({
        resolver: zodResolver(consultationSchema),
        defaultValues: { vitals: {}, patientId: initialPatientId, insurance: 'Personal' },
        values: consultation
            ? {
                  patientId: consultation.patientId,
                  consultationDate: consultation.consultationDate.slice(0, 10),
                  chiefComplaint: consultation.chiefComplaint,
                  subjective: consultation.subjective,
                  objective: consultation.objective,
                  assessment: consultation.assessment,
                  plan: consultation.plan,
                  vitals: {
                      height: consultation.vitals.height.toString(),
                      weight: consultation.vitals.weight?.toString() ?? '',
                      temperature: consultation.vitals.temperature?.toString() ?? '',
                  },
                  insurance: consultation.insurance,
                  payment: consultation.payment.toString(),
              }
            : undefined,
    });
    const [createConsultation] = useCreateConsultationMutation();
    const [updateConsultation] = useUpdateConsultationMutation();
    const [deleteConsultation, { isLoading: isDeleting }] = useDeleteConsultationMutation();

    const { data: insurancesResponse } = useGetInsurancesQuery();
    const insurances = insurancesResponse?.status === 'ok' ? insurancesResponse.data : [];

    const {
        field: { value: selectedPatientId, onChange: setSelectedPatientId },
    } = useController({ control, name: 'patientId' });

    const { data: patientsResponse } = useGetPatientsQuery();
    const patients = patientsResponse?.status === 'ok' ? patientsResponse.data : [];
    const selectedPatient = patients.find((patient) => patient.id === selectedPatientId);

    const {
        data: historyResponse,
        isLoading: isHistoryLoading,
        isError: isHistoryError,
    } = useGetConsultationsByPatientIdQuery(selectedPatientId as IDBrand, {
        skip: !selectedPatientId,
    });
    const history = historyResponse?.status === 'ok' ? historyResponse.data : [];
    const sortedHistory = [...history].sort(
        (a, b) => new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime()
    );

    const onSubmit = async (data: ConsultationSchemaType) => {
        try {
            const response = id
                ? await updateConsultation({
                      id: id as IDBrand,
                      data: {
                          consultationDate: data.consultationDate,
                          chiefComplaint: data.chiefComplaint,
                          subjective: data.subjective,
                          objective: data.objective,
                          assessment: data.assessment,
                          plan: data.plan,
                          vitals: data.vitals,
                          insurance: data.insurance as IDBrand | 'Personal',
                          payment: data.payment,
                      },
                  }).unwrap()
                : await createConsultation({
                      ...data,
                      patientId: data.patientId as IDBrand,
                      insurance: data.insurance as IDBrand | 'Personal',
                  }).unwrap();

            if (response.status === 'error') {
                setErrorMessage(response.message);
                return;
            }
            navigate('/consultations');
        } catch {
            setErrorMessage(
                isEditMode
                    ? 'Failed to update consultation. Please try again.'
                    : 'Failed to add consultation. Please try again.'
            );
        }
    };

    const handleSelectDiagnosis = (diagnosis: DiagnosisType) => {
        const currentAssessment = getValues('assessment').trim();
        const nextAssessment = currentAssessment
            ? `${currentAssessment}\n${diagnosis.diagnosis}`
            : diagnosis.diagnosis;
        setValue('assessment', nextAssessment, { shouldDirty: true, shouldValidate: true });
    };

    const handleSelectMedicine = (medicine: MedicineType) => {
        const currentPlan = getValues('plan').trim();
        const medicineText = `${medicine.medicine} - ${medicine.description}`;
        const nextPlan = currentPlan ? `${currentPlan}\n${medicineText}` : medicineText;
        setValue('plan', nextPlan, { shouldDirty: true, shouldValidate: true });
    };

    const handleDelete = async () => {
        if (!id) return;

        try {
            const response = await deleteConsultation(id as IDBrand).unwrap();
            if (response.status === 'error') {
                setDeleteError(response.message);
                return;
            }
            navigate('/consultations');
        } catch {
            setDeleteError('Failed to delete consultation. Please try again.');
        }
    };

    return (
        <div className={twMerge('flex h-full min-h-0 flex-col gap-6', className)}>
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/consultations')}
                        className="flex w-fit cursor-pointer items-center gap-2 text-base font-medium text-slate-500 transition-colors hover:text-blue-700"
                    >
                        <ArrowLeft size={20} strokeWidth={2} />
                        Back to Consultations
                    </button>

                    <div className="h-6 w-px shrink-0 bg-blue-200" />

                    <h1 className="text-2xl font-bold text-blue-950">
                        {isEditMode ? 'Edit Consultation' : 'New Consultation'}
                    </h1>
                </div>

                {isEditMode && (
                    <Button
                        label="Delete"
                        Icon={Trash2}
                        variant="ghost"
                        className="w-auto text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    />
                )}
            </div>

            {deleteError && (
                <p className="shrink-0 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {deleteError}
                </p>
            )}

            {isEditMode && isConsultationLoading && (
                <p className="shrink-0 text-base text-slate-500">Loading consultation...</p>
            )}

            {isConsultationUnavailable && !isConsultationLoading && (
                <p className="shrink-0 rounded-lg bg-red-50 px-4 py-3 text-base text-red-600">
                    Failed to load this consultation. Please try refreshing the page.
                </p>
            )}

            {!isConsultationUnavailable && (
                <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
                    <form
                        className="item-shadow flex h-full min-h-0 flex-col rounded-2xl border border-blue-100 bg-white p-8 lg:col-span-2"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Patient
                                </label>
                                <button
                                    type="button"
                                    disabled={isEditMode}
                                    onClick={() => setIsPatientModalOpen(true)}
                                    className={twMerge(
                                        'flex w-full items-center justify-between rounded-lg border border-blue-200 px-4 py-3 text-left transition outline-none',
                                        isEditMode
                                            ? 'cursor-not-allowed bg-blue-50 text-blue-600'
                                            : 'cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                                    )}
                                >
                                    <span
                                        className={
                                            selectedPatient ? 'text-slate-900' : 'text-slate-400'
                                        }
                                    >
                                        {selectedPatient
                                            ? getPatientFullName(selectedPatient)
                                            : 'Select a patient'}
                                    </span>
                                    {!isEditMode && (
                                        <ChevronDown
                                            size={18}
                                            className="shrink-0 text-slate-400"
                                        />
                                    )}
                                </button>
                                {errors.patientId?.message && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.patientId.message}
                                    </p>
                                )}
                            </div>

                            <Input
                                label="Consultation Date"
                                type="date"
                                {...register('consultationDate')}
                                error={errors.consultationDate?.message}
                            />

                            <Input
                                label="Chief Complaint"
                                {...register('chiefComplaint')}
                                error={errors.chiefComplaint?.message}
                            />

                            <Textarea
                                label="Subjective"
                                {...register('subjective')}
                                error={errors.subjective?.message}
                            />
                            <Textarea
                                label="Objective"
                                {...register('objective')}
                                error={errors.objective?.message}
                            />
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-700">
                                        Assessment
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setIsDiagnosisModalOpen(true)}
                                        className="flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        <Stethoscope size={14} strokeWidth={2} />
                                        Add Diagnosis
                                    </button>
                                </div>
                                <Textarea
                                    {...register('assessment')}
                                    error={errors.assessment?.message}
                                />
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-700">
                                        Plan
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setIsMedicineModalOpen(true)}
                                        className="flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        <Pill size={14} strokeWidth={2} />
                                        Add Medicine
                                    </button>
                                </div>
                                <Textarea {...register('plan')} error={errors.plan?.message} />
                            </div>

                            <div className="grid grid-cols-1 gap-4 border-t border-blue-100 pt-4 sm:grid-cols-2">
                                <Input
                                    label="Height (cm)"
                                    type="number"
                                    step="0.1"
                                    {...register('vitals.height')}
                                    error={errors.vitals?.height?.message}
                                />
                                <Input
                                    label="Weight (kg)"
                                    type="number"
                                    step="0.1"
                                    {...register('vitals.weight')}
                                    error={errors.vitals?.weight?.message}
                                />
                                <Input
                                    label="Temperature (°C)"
                                    type="number"
                                    step="0.1"
                                    {...register('vitals.temperature')}
                                    error={errors.vitals?.temperature?.message}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 border-t border-blue-100 pt-4 sm:grid-cols-2">
                                <Select
                                    label="Insurance"
                                    {...register('insurance')}
                                    error={errors.insurance?.message}
                                >
                                    <option value="Personal">Personal (self-pay)</option>
                                    {insurances.map((insurance) => (
                                        <option key={insurance.id} value={insurance.id}>
                                            {insurance.insurance}
                                        </option>
                                    ))}
                                </Select>
                                <Input
                                    label="Payment"
                                    type="number"
                                    step="0.01"
                                    {...register('payment')}
                                    error={errors.payment?.message}
                                />
                            </div>

                            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    label="Cancel"
                                    variant="ghost"
                                    className="w-auto"
                                    onClick={() => navigate('/consultations')}
                                />
                                <Button
                                    type="submit"
                                    label={
                                        isSubmitting
                                            ? 'Saving...'
                                            : isEditMode
                                              ? 'Save Changes'
                                              : 'Save Consultation'
                                    }
                                    className="w-auto"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </form>

                    <div className="item-shadow flex h-full min-h-0 flex-col rounded-2xl border border-blue-100 bg-white p-6">
                        <div className="shrink-0">
                            <h2 className="text-xl font-semibold text-blue-950">Patient</h2>

                            {selectedPatientId && selectedPatient && (
                                <p className="mt-1 text-sm text-slate-500">
                                    {getPatientFullName(selectedPatient)}
                                </p>
                            )}
                        </div>

                        {!selectedPatientId && (
                            <p className="mt-2 text-base text-slate-500">
                                Select a patient to see their history and information.
                            </p>
                        )}

                        {selectedPatientId && (
                            <>
                                <div className="mt-4 flex shrink-0 gap-1 border-b border-blue-100">
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
                                        History
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('info')}
                                        className={twMerge(
                                            'cursor-pointer border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                                            activeTab === 'info'
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-slate-500 hover:text-blue-700'
                                        )}
                                    >
                                        Patient Info
                                    </button>
                                </div>

                                <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
                                    {activeTab === 'history' && (
                                        <>
                                            {isHistoryLoading && (
                                                <p className="text-base text-slate-500">
                                                    Loading history...
                                                </p>
                                            )}
                                            {isHistoryError && (
                                                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                                    Failed to load consultation history.
                                                </p>
                                            )}
                                            {!isHistoryLoading && !isHistoryError && (
                                                <ConsultationHistoryList
                                                    consultations={sortedHistory}
                                                />
                                            )}
                                        </>
                                    )}

                                    {activeTab === 'info' && selectedPatient && (
                                        <div className="flex flex-col gap-4">
                                            <DetailField
                                                Icon={Cake}
                                                label="Age"
                                                value={`${calculateAge(selectedPatient.dateOfBirth)} years old`}
                                            />
                                            <DetailField
                                                Icon={User}
                                                label="Sex"
                                                value={
                                                    selectedPatient.sex.charAt(0).toUpperCase() +
                                                    selectedPatient.sex.slice(1)
                                                }
                                            />
                                            <DetailField
                                                Icon={Droplet}
                                                label="Blood Type"
                                                value={
                                                    selectedPatient.bloodType &&
                                                    selectedPatient.bloodType !== 'unknown'
                                                        ? selectedPatient.bloodType
                                                        : 'Unknown'
                                                }
                                            />
                                            <DetailField
                                                Icon={Calendar}
                                                label="Date of Birth"
                                                value={formatDate(selectedPatient.dateOfBirth)}
                                            />
                                            <DetailField
                                                Icon={Phone}
                                                label="Contact Number"
                                                value={selectedPatient.contactNumber}
                                            />
                                            <DetailField
                                                Icon={MapPin}
                                                label="Address"
                                                value={selectedPatient.address || '—'}
                                            />

                                            <AllergyBanner allergies={selectedPatient.allergies} />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {!isEditMode && (
                <CP_SelectPatientModal
                    isOpen={isPatientModalOpen}
                    onClose={() => setIsPatientModalOpen(false)}
                    onSelect={(patient) => setSelectedPatientId(patient.id)}
                />
            )}

            <CP_SelectDiagnosisModal
                isOpen={isDiagnosisModalOpen}
                onClose={() => setIsDiagnosisModalOpen(false)}
                onSelect={handleSelectDiagnosis}
            />

            <CP_SelectMedicineModal
                isOpen={isMedicineModalOpen}
                onClose={() => setIsMedicineModalOpen(false)}
                onSelect={handleSelectMedicine}
            />

            {isEditMode && (
                <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleDelete}
                    title="Delete Consultation"
                    description="Are you sure you want to delete this consultation? This action cannot be undone."
                    confirmLabel="Delete"
                    isConfirming={isDeleting}
                />
            )}
        </div>
    );
};

export default ConsultationFormPageLayout;
