// 📦 LIBRARIES IMPORT
import { Navigate, Outlet } from 'react-router';

/* ===================================================================== */
/*🧩 AUTH GUARD - Guards pages to authorization*/

const AuthGuard = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AuthGuard;
