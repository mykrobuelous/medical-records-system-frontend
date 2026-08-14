// 📦 LIBRARIES IMPORT
import type { LucideIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/* ===================================================================== */
/* 🧩 NAV ITEMS - Nav items for the navbar */

interface Props {
    className?: string;
    label: string;
    Icon?: LucideIcon;
    active?: boolean;
    onClick?: () => void;
}

const NB_NavItems: React.FC<Props> = ({ className, label, Icon, active = false, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={twMerge(
                'group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5',
                'text-sm transition-colors',

                active
                    ? 'bg-white font-semibold text-blue-700 shadow-sm'
                    : 'font-medium text-blue-100 hover:bg-white/10 hover:text-white',

                className
            )}
        >
            {Icon && (
                <Icon
                    size={20}
                    strokeWidth={2}
                    className={twMerge(
                        'shrink-0 transition-colors',
                        active ? 'text-blue-700' : 'text-blue-300 group-hover:text-white'
                    )}
                />
            )}

            <span>{label}</span>
        </button>
    );
};

export default NB_NavItems;
