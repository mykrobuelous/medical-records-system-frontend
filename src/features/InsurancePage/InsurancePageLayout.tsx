// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import IN_InsuranceFormModal from './components/IN_InsuranceFormModal';
import IN_InsuranceSummaryList, {
    type InsuranceSummaryRow,
} from './components/IN_InsuranceSummaryList';
import { useGetConsultationsQuery } from '../../shared/api/endpoints/consultationEndpoint';
import { useGetPatientsQuery } from '../../shared/api/endpoints/patientEndpoint';
import {
    useDeleteInsuranceMutation,
    useGetInsurancesQuery,
} from '../../shared/api/endpoints/insuranceEndpoint';
import { formatDate, isWithinDateRange } from '../../shared/utils/dateUtils';
import { getPatientFullName } from '../../shared/utils/patientUtils';
import type { InsuranceType, PatientType } from '../../shared/data/data.types';
import type { IDBrand } from '../../shared/utils/idUtils';

/* ===================================================================== */
/*🧩 INSURANCE PAGE LAYOUT - Consultations by insurance/date, plus an insurance summary + CRUD view*/

interface Props {
    className?: string;
}

type DateSortDirection = 'asc' | 'desc';
type InsuranceView = 'consultations' | 'summary';

const InsurancePageLayout: React.FC<Props> = ({ className }) => {
    const navigate = useNavigate();
    const [view, setView] = useState<InsuranceView>('consultations');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [dateSort, setDateSort] = useState<DateSortDirection>('desc');
    const [selectedInsuranceKeys, setSelectedInsuranceKeys] = useState<Set<string>>(new Set());

    const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
    const [editingInsurance, setEditingInsurance] = useState<InsuranceType | undefined>(undefined);
    const [deletingInsurance, setDeletingInsurance] = useState<InsuranceType | undefined>(
        undefined
    );
    const [insuranceDeleteError, setInsuranceDeleteError] = useState<string | null>(null);

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
    const {
        data: insurancesResponse,
        isLoading: isInsurancesLoading,
        isError: isInsurancesError,
    } = useGetInsurancesQuery();
    const [deleteInsurance, { isLoading: isDeletingInsurance }] = useDeleteInsuranceMutation();

    const consultations = consultationsResponse?.status === 'ok' ? consultationsResponse.data : [];
    const patients = patientsResponse?.status === 'ok' ? patientsResponse.data : [];
    const insurances = insurancesResponse?.status === 'ok' ? insurancesResponse.data : [];

    const isLoading = isConsultationsLoading || isPatientsLoading;
    const hasLoadError =
        isConsultationsError ||
        isPatientsError ||
        consultationsResponse?.status === 'error' ||
        patientsResponse?.status === 'error';
    const hasInsurancesLoadError = isInsurancesError || insurancesResponse?.status === 'error';

    const patientById = new Map<IDBrand, PatientType>(
        patients.map((patient) => [patient.id, patient])
    );
    const insuranceNameById = new Map<IDBrand, string>(
        insurances.map((insurance) => [insurance.id, insurance.insurance])
    );

    const getInsuranceLabel = (insurance: IDBrand | 'Personal'): string =>
        insurance === 'Personal' ? 'Personal' : (insuranceNameById.get(insurance) ?? 'Unknown');

    const toggleInsuranceKey = (key: string) => {
        setSelectedInsuranceKeys((current) => {
            const next = new Set(current);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const filteredConsultations = consultations.filter((consultation) => {
        if (!isWithinDateRange(consultation.consultationDate, fromDate, toDate)) return false;
        if (selectedInsuranceKeys.size > 0 && !selectedInsuranceKeys.has(consultation.insurance)) {
            return false;
        }
        return true;
    });

    const sortedConsultations = [...filteredConsultations].sort((a, b) => {
        const diff =
            new Date(a.consultationDate).getTime() - new Date(b.consultationDate).getTime();
        return dateSort === 'asc' ? diff : -diff;
    });

    const toggleDateSort = () => {
        setDateSort((current) => (current === 'asc' ? 'desc' : 'asc'));
    };

    const DateSortIcon = dateSort === 'asc' ? ArrowUp : ArrowDown;

    // Consultations still referencing an insurance block that insurance from being deleted.
    const insuranceIdsInUse = new Set<IDBrand>();
    for (const consultation of consultations) {
        if (consultation.insurance !== 'Personal') insuranceIdsInUse.add(consultation.insurance);
    }

    const dateFilteredConsultations = consultations.filter((consultation) =>
        isWithinDateRange(consultation.consultationDate, fromDate, toDate)
    );

    const summaryTotalsByKey = new Map<string, { total: number; count: number }>();
    for (const consultation of dateFilteredConsultations) {
        const existing = summaryTotalsByKey.get(consultation.insurance) ?? { total: 0, count: 0 };
        summaryTotalsByKey.set(consultation.insurance, {
            total: existing.total + consultation.payment,
            count: existing.count + 1,
        });
    }

    const summaryRows: InsuranceSummaryRow[] = [
        {
            key: 'Personal',
            label: 'Personal',
            total: summaryTotalsByKey.get('Personal')?.total ?? 0,
            count: summaryTotalsByKey.get('Personal')?.count ?? 0,
            isDeletable: false,
        },
        ...insurances.map((insurance) => ({
            key: insurance.id,
            label: insurance.insurance,
            total: summaryTotalsByKey.get(insurance.id)?.total ?? 0,
            count: summaryTotalsByKey.get(insurance.id)?.count ?? 0,
            insurance,
            isDeletable: !insuranceIdsInUse.has(insurance.id),
        })),
    ];

    const totalAmount = (
        view === 'consultations' ? sortedConsultations : dateFilteredConsultations
    ).reduce((sum, consultation) => sum + consultation.payment, 0);

    const openAddInsurance = () => {
        setEditingInsurance(undefined);
        setIsInsuranceModalOpen(true);
    };
    const closeInsuranceModal = () => {
        setIsInsuranceModalOpen(false);
        setEditingInsurance(undefined);
    };
    const handleDeleteInsurance = async () => {
        if (!deletingInsurance) return;

        try {
            const response = await deleteInsurance(deletingInsurance.id).unwrap();
            if (response.status === 'error') {
                setInsuranceDeleteError(response.message);
                setDeletingInsurance(undefined);
                return;
            }
            setDeletingInsurance(undefined);
            setInsuranceDeleteError(null);
        } catch {
            setInsuranceDeleteError('Failed to delete insurance. Please try again.');
            setDeletingInsurance(undefined);
        }
    };

    return (
        <div className={twMerge('flex h-full min-h-0 flex-col gap-6', className)}>
            <div className="grid grid-cols-3 items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-blue-950">Insurance</h1>
                    <p className="text-sm text-slate-500">Consultations by insurance and date</p>
                </div>

                <div className="flex items-center justify-center gap-1 justify-self-center rounded-lg border border-blue-200 bg-white p-1">
                    <button
                        type="button"
                        onClick={() => setView('consultations')}
                        className={twMerge(
                            'cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                            view === 'consultations'
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 hover:bg-blue-50'
                        )}
                    >
                        Consultations
                    </button>
                    <button
                        type="button"
                        onClick={() => setView('summary')}
                        className={twMerge(
                            'cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                            view === 'summary'
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 hover:bg-blue-50'
                        )}
                    >
                        Summary
                    </button>
                </div>

                <div className="text-right">
                    <p className="text-sm text-slate-500">Total Amount</p>
                    <p className="text-xl font-bold text-blue-950">₱{totalAmount.toFixed(2)}</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3">
                {view === 'consultations' ? (
                    <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1">
                        <button
                            type="button"
                            onClick={() => toggleInsuranceKey('Personal')}
                            className={twMerge(
                                'shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                                selectedInsuranceKeys.has('Personal')
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-blue-200 bg-white text-slate-600 hover:border-blue-400'
                            )}
                        >
                            Personal
                        </button>
                        {insurances.map((insurance) => (
                            <button
                                key={insurance.id}
                                type="button"
                                onClick={() => toggleInsuranceKey(insurance.id)}
                                className={twMerge(
                                    'shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                                    selectedInsuranceKeys.has(insurance.id)
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-blue-200 bg-white text-slate-600 hover:border-blue-400'
                                )}
                            >
                                {insurance.insurance}
                            </button>
                        ))}
                    </div>
                ) : (
                    <Button
                        label="Add Insurance"
                        Icon={Plus}
                        className="w-auto"
                        onClick={openAddInsurance}
                    />
                )}

                <div className="flex shrink-0 flex-wrap items-center gap-2">
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
            </div>

            {hasLoadError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    Failed to load consultations. Please try refreshing the page.
                </p>
            )}

            {insuranceDeleteError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {insuranceDeleteError}
                </p>
            )}

            {view === 'consultations' && (
                <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-blue-100 bg-white">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 z-10 border-b border-blue-100 bg-blue-50">
                            <tr>
                                <th className="px-4 py-3 text-sm font-semibold text-blue-700">
                                    Patient
                                </th>
                                <th className="px-4 py-3 text-sm font-semibold text-blue-700">
                                    <button
                                        type="button"
                                        onClick={toggleDateSort}
                                        className="flex cursor-pointer items-center gap-1 hover:text-blue-900"
                                    >
                                        Date
                                        <DateSortIcon size={14} strokeWidth={2} />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-sm font-semibold text-blue-700">
                                    Insurance
                                </th>
                                <th className="px-4 py-3 text-sm font-semibold text-blue-700">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            {isLoading && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-6 text-center text-sm text-slate-500"
                                    >
                                        Loading consultations...
                                    </td>
                                </tr>
                            )}

                            {!isLoading && sortedConsultations.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-6 text-center text-sm text-slate-500"
                                    >
                                        {fromDate || toDate || selectedInsuranceKeys.size > 0
                                            ? 'No consultations match your filters.'
                                            : 'No consultations yet.'}
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                sortedConsultations.map((consultation) => {
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
                                                {formatDate(consultation.consultationDate)}
                                            </td>
                                            <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-600">
                                                {getInsuranceLabel(consultation.insurance)}
                                            </td>
                                            <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-600">
                                                ₱{consultation.payment.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'summary' && (
                <IN_InsuranceSummaryList
                    className="flex min-h-0 flex-1 flex-col"
                    rows={summaryRows}
                    isLoading={isInsurancesLoading || isConsultationsLoading}
                    hasLoadError={hasInsurancesLoadError}
                    onEdit={(insurance) => {
                        setEditingInsurance(insurance);
                        setIsInsuranceModalOpen(true);
                    }}
                    onDelete={setDeletingInsurance}
                />
            )}

            <IN_InsuranceFormModal
                isOpen={isInsuranceModalOpen}
                onClose={closeInsuranceModal}
                insurance={editingInsurance}
            />
            <ConfirmDialog
                isOpen={Boolean(deletingInsurance)}
                onClose={() => setDeletingInsurance(undefined)}
                onConfirm={handleDeleteInsurance}
                title="Delete Insurance"
                description={`Are you sure you want to delete "${deletingInsurance?.insurance}"? This action cannot be undone.`}
                confirmLabel="Delete"
                isConfirming={isDeletingInsurance}
            />
        </div>
    );
};

export default InsurancePageLayout;
