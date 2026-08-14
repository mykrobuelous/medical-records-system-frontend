import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import LoginPageLayout from '../../features/LoginPage/LoginPageLayout';
import AuthGuard from './AuthGuard';
import DashboardPageLayout from '../../features/DashboardPage/DashboardPageLayout';
import MainLayout from './MainLayout';
import ConsultationsPageLayout from '../../features/ConsultationsPage/ConsultationsPageLayout';
import ConsultationFormPageLayout from '../../features/ConsultationsPage/ConsultationFormPageLayout';
import PatientsPageLayout from '../../features/PatientsPage/PatientsPageLayout';
import PatientDetailPageLayout from '../../features/PatientDetailPage/PatientDetailPageLayout';
/* ===================================================================== */
/*🧩 APP LAYOUT - Where the routes for react router live*/

const AppLayout = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPageLayout />} />
                <Route element={<AuthGuard />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<DashboardPageLayout />} />
                        <Route path="/patients" element={<PatientsPageLayout />} />
                        <Route path="/patients/:id" element={<PatientDetailPageLayout />} />
                        <Route path="/consultations" element={<ConsultationsPageLayout />} />
                        <Route path="/consultations/new" element={<ConsultationFormPageLayout />} />
                        <Route
                            path="/consultations/:id/edit"
                            element={<ConsultationFormPageLayout />}
                        />
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppLayout;
