// 📦 LIBRARIES IMPORT
import { Outlet } from 'react-router';
import { twMerge } from 'tailwind-merge';
import NavBarLayout from '../../features/NavBar/NavBarLayout';

/* ===================================================================== */
/*🧩 MAIN LAYOUT - Main Layout with Navbar*/

interface Props {
    className?: string;
}

const MainLayout: React.FC<Props> = ({ className }) => {
    return (
        <div className={twMerge('view-screen flex', className)}>
            <NavBarLayout />
            <div
                className={twMerge(
                    'flex min-h-0 flex-1 flex-col overflow-y-auto bg-blue-50/60 p-8',
                    className
                )}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
