// 📦 LIBRARIES IMPORT
import type { LucideIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/* ===================================================================== */
/* 🧩 BUTTON - Generic Button of the application */

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    label: string;
    Icon?: LucideIcon;
    variant?: 'primary' | 'ghost';
}

const Button: React.FC<Props> = ({ className, label, Icon, variant = 'primary', ...props }) => {
    return (
        <button
            {...props}
            className={twMerge(
                'flex w-full items-center justify-center gap-4 rounded-lg',
                'px-4 py-2.5 text-sm font-medium',
                'transition-all active:scale-[0.98]',
                'cursor-pointer',

                variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',

                variant === 'ghost' && 'text-slate-600 hover:bg-blue-50 hover:text-blue-900',

                className
            )}
        >
            {Icon && <Icon size={20} strokeWidth={1.8} />}

            {label}
        </button>
    );
};

export default Button;
