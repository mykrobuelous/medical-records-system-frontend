// 📦 LIBRARIES IMPORT
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { CalendarClock, ClipboardList, ClipboardPlus, UserPlus, Users } from 'lucide-react';
import Button from '../../shared/components/Button';
import PP_PatientFormModal from '../PatientsPage/components/PP_PatientFormModal';
import { useGetPatientsQuery } from '../../shared/api/endpoints/patientEndpoint';
import { useGetConsultationsQuery } from '../../shared/api/endpoints/consultationEndpoint';
import { isSameDay } from '../../shared/utils/dateUtils';
import DB_StatCard from './components/DB_StatCard';
import DB_RecentConsultations from './components/DB_RecentConsultations';
import DB_RecentPatients from './components/DB_RecentPatients';

/* ===================================================================== */
/*🧩 DASHBOARD PAGE LAYOUT - It shows the dashboard*/

interface Props {
    className?: string;
}

const RECENT_ITEM_LIMIT = 5;
const NEW_PATIENT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

const DashboardPageLayout: React.FC<Props> = ({ className }) => {
    const navigate = useNavigate();
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

    const {
        data: patientsResponse,
        isLoading: isPatientsLoading,
        isError: isPatientsError,
    } = useGetPatientsQuery();
    const {
        data: consultationsResponse,
        isLoading: isConsultationsLoading,
        isError: isConsultationsError,
    } = useGetConsultationsQuery();

    const patients = patientsResponse?.status === 'ok' ? patientsResponse.data : [];
    const consultations = consultationsResponse?.status === 'ok' ? consultationsResponse.data : [];

    const isLoading = isPatientsLoading || isConsultationsLoading;
    const hasLoadError =
        isPatientsError ||
        isConsultationsError ||
        patientsResponse?.status === 'error' ||
        consultationsResponse?.status === 'error';

    const today = new Date().toISOString();
    const newPatientCutoff = new Date(today).getTime() - NEW_PATIENT_WINDOW_MS;

    const consultationsToday = consultations.filter((consultation) =>
        isSameDay(consultation.consultationDate, today)
    );
    const newPatients = patients.filter(
        (patient) => new Date(patient.createdAt).getTime() >= newPatientCutoff
    );

    const recentConsultations = [...consultations]
        .sort(
            (a, b) =>
                new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime()
        )
        .slice(0, RECENT_ITEM_LIMIT);

    const recentPatients = [...patients]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, RECENT_ITEM_LIMIT);

    const patientNameById = new Map(
        patients.map((patient) => [patient.id, `${patient.firstName} ${patient.lastName}`])
    );

    return (
        <div className={twMerge('flex h-full min-h-0 flex-col gap-4', className)}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-blue-950">Dashboard</h1>
                    <p className="text-sm text-slate-500">Overview of patients and consultations</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button
                        label="Add Patient"
                        Icon={UserPlus}
                        variant="ghost"
                        className="w-auto border border-blue-200"
                        onClick={() => setIsAddPatientModalOpen(true)}
                    />
                    <Button
                        label="Add Consultation"
                        Icon={ClipboardPlus}
                        className="w-auto"
                        onClick={() => navigate('/consultations/new')}
                    />
                </div>
            </div>

            {hasLoadError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    Failed to load some dashboard data. Please try refreshing the page.
                </p>
            )}

            <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DB_StatCard
                    label="Total Patients"
                    value={patients.length}
                    Icon={Users}
                    isLoading={isLoading}
                />
                <DB_StatCard
                    label="Total Consultations"
                    value={consultations.length}
                    Icon={ClipboardList}
                    isLoading={isLoading}
                />
                <DB_StatCard
                    label="Consultations Today"
                    value={consultationsToday.length}
                    Icon={CalendarClock}
                    isLoading={isLoading}
                />
                <DB_StatCard
                    label="New Patients (30d)"
                    value={newPatients.length}
                    Icon={UserPlus}
                    isLoading={isLoading}
                />
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
                <DB_RecentConsultations
                    consultations={recentConsultations}
                    patientNameById={patientNameById}
                    isLoading={isLoading}
                />
                <DB_RecentPatients patients={recentPatients} isLoading={isLoading} />
            </div>

            <PP_PatientFormModal
                isOpen={isAddPatientModalOpen}
                onClose={() => setIsAddPatientModalOpen(false)}
            />
        </div>
    );
};

export default DashboardPageLayout;
