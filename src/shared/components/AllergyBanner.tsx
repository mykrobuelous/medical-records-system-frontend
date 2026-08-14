// 📦 LIBRARIES IMPORT
import { TriangleAlert } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/* ===================================================================== */
/*🧩 ALLERGY BANNER - Highlighted allergy callout for a patient*/

interface Props {
    className?: string;
    allergies?: string;
}

const AllergyBanner: React.FC<Props> = ({ className, allergies }) => (
    <div
        className={twMerge(
            'flex items-start gap-3 rounded-xl border p-4',
            allergies ? 'border-amber-200 bg-amber-50' : 'border-blue-100 bg-blue-50',
            className
        )}
    >
        <TriangleAlert
            size={20}
            strokeWidth={1.8}
            className={twMerge('mt-0.5 shrink-0', allergies ? 'text-amber-600' : 'text-blue-400')}
        />
        <div>
            <p
                className={twMerge(
                    'text-sm font-semibold',
                    allergies ? 'text-amber-800' : 'text-blue-600'
                )}
            >
                Allergies
            </p>
            <p className={twMerge('text-base', allergies ? 'text-amber-700' : 'text-blue-600')}>
                {allergies || 'None recorded'}
            </p>
        </div>
    </div>
);

export default AllergyBanner;
