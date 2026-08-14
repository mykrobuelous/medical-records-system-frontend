// 📦 LIBRARIES IMPORT
import type { LucideIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/* ===================================================================== */
/* 🧩 STAT CARD - A single KPI tile on the dashboard */

interface Props {
    className?: string;
    label: string;
    value: number;
    Icon: LucideIcon;
    isLoading?: boolean;
}

const DB_StatCard: React.FC<Props> = ({ className, label, value, Icon, isLoading = false }) => {
    return (
        <div
            className={twMerge(
                'flex items-center gap-4 rounded-xl border border-blue-100 bg-white p-5',
                'item-shadow',
                className
            )}
        >
            <div className="flex-center h-12 w-12 rounded-lg bg-blue-50 text-blue-600">
                <Icon size={24} strokeWidth={1.8} />
            </div>

            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900">{isLoading ? '—' : value}</p>
            </div>
        </div>
    );
};

export default DB_StatCard;
