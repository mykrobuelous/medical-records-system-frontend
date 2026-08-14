// 📦 LIBRARIES IMPORT
import { twMerge } from 'tailwind-merge';
import { ClipboardPlus, HeartPulse, LayoutDashboard, LogOut, User } from 'lucide-react';

import NB_NavItems from './components/NB_NavItems';
import Button from '../../shared/components/Button';
import { useLocation, useNavigate } from 'react-router';

/* ===================================================================== */
/* 🧩 NAVBAR LAYOUT - The navigation bar */

interface Props {
    className?: string;
}

const NavBarLayout: React.FC<Props> = ({ className }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const onLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    return (
        <nav
            className={twMerge(
                'flex h-screen w-64 flex-col',
                'bg-linear-to-b from-blue-700 to-blue-800',
                'px-4 py-6',
                className
            )}
        >
            {/* Header */}
            <div className="mb-8 flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                    <HeartPulse size={20} strokeWidth={2} className="text-blue-700" />
                </div>

                <div>
                    <p className="text-xs font-medium tracking-widest text-blue-200 uppercase">
                        Medical
                    </p>
                    <h1 className="text-lg leading-tight font-bold tracking-tight text-white">
                        Records System
                    </h1>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-1 flex-col gap-1">
                <NB_NavItems
                    label="Dashboard"
                    Icon={LayoutDashboard}
                    active={location.pathname === '/'}
                    onClick={() => navigate('/')}
                />

                <NB_NavItems
                    label="Patients"
                    Icon={User}
                    active={location.pathname.startsWith('/patients')}
                    onClick={() => navigate('/patients')}
                />

                <NB_NavItems
                    label="Consultations"
                    Icon={ClipboardPlus}
                    active={location.pathname.startsWith('/consultations')}
                    onClick={() => navigate('/consultations')}
                />
            </div>

            {/* Footer */}
            <div className="border-t border-blue-500/30 pt-4">
                <Button
                    label="Log out"
                    Icon={LogOut}
                    variant="ghost"
                    className="justify-start gap-3 px-3 text-blue-100 hover:bg-red-500/20 hover:text-red-100"
                    onClick={onLogout}
                />
            </div>
        </nav>
    );
};

export default NavBarLayout;
