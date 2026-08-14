// 📦 LIBRARIES IMPORT
import type { LucideIcon } from 'lucide-react';

/* ===================================================================== */
/*🧩 DETAIL FIELD - Icon + label + value row for read-only record details*/

interface Props {
    Icon: LucideIcon;
    label: string;
    value: string;
}

const DetailField: React.FC<Props> = ({ Icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
            <Icon size={18} strokeWidth={1.8} />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-base text-slate-900">{value}</p>
        </div>
    </div>
);

export default DetailField;
