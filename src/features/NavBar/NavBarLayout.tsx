// 📦 LIBRARIES IMPORT
import { twMerge } from 'tailwind-merge';
import {
    BookOpen,
    ClipboardPlus,
    HeartPulse,
    LayoutDashboard,
    LogOut,
    ShieldCheck,
    User,
} from 'lucide-react';

import NB_NavItems from './components/NB_NavItems';
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
                'flex h-screen w-52 flex-col',
                'bg-linear-to-b from-blue-700 to-blue-800',
                'px-3 py-5',
                className
            )}
        >
            {/* Header */}
            <div className="mb-6 flex items-center gap-2 px-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                    <HeartPulse size={16} strokeWidth={2} className="text-blue-700" />
                </div>

                <div>
                    <p className="text-[10px] font-medium tracking-widest text-blue-200 uppercase">
                        Medical
                    </p>
                    <h1 className="text-sm leading-tight font-bold tracking-tight text-white">
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

                <NB_NavItems
                    label="Insurance"
                    Icon={ShieldCheck}
                    active={location.pathname.startsWith('/insurance')}
                    onClick={() => navigate('/insurance')}
                />

                <NB_NavItems
                    label="Catalog"
                    Icon={BookOpen}
                    active={location.pathname.startsWith('/catalog')}
                    onClick={() => navigate('/catalog')}
                />
            </div>

            {/* Footer */}
            <div className="border-t border-blue-500/30 pt-3">
                <button
                    type="button"
                    onClick={onLogout}
                    className="group flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-blue-100 transition-colors hover:bg-white/10 hover:text-white"
                >
                    <LogOut
                        size={18}
                        strokeWidth={2}
                        className="shrink-0 text-blue-300 transition-colors group-hover:text-rose-300"
                    />
                    <span>Log out</span>
                </button>
            </div>
        </nav>
    );
};

export default NavBarLayout;
