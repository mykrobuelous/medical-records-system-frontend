// 📦 LIBRARIES IMPORT
import { Pencil, Trash2 } from 'lucide-react';
import type { InsuranceType } from '../../../shared/data/data.types';

/* ===================================================================== */
/*🧩 INSURANCE SUMMARY LIST - Per-insurance consultation totals, with CRUD actions*/

export interface InsuranceSummaryRow {
    key: string;
    label: string;
    total: number;
    count: number;
    insurance?: InsuranceType;
    isDeletable: boolean;
}

interface Props {
    className?: string;
    rows: InsuranceSummaryRow[];
    isLoading?: boolean;
    hasLoadError?: boolean;
    onEdit: (insurance: InsuranceType) => void;
    onDelete: (insurance: InsuranceType) => void;
}

const IN_InsuranceSummaryList: React.FC<Props> = ({
    className,
    rows,
    isLoading = false,
    hasLoadError = false,
    onEdit,
    onDelete,
}) => {
    return (
        <div className={className}>
            {hasLoadError && (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    Failed to load insurances. Please try refreshing the page.
                </p>
            )}

            <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-blue-100 bg-white">
                <table className="w-full text-left">
                    <thead className="sticky top-0 z-10 border-b border-blue-100 bg-blue-50">
                        <tr>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">
                                Insurance
                            </th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">
                                Consultations
                            </th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700">Total</th>
                            <th className="px-4 py-3 text-sm font-semibold text-blue-700" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50">
                        {isLoading && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-6 text-center text-sm text-slate-500"
                                >
                                    Loading insurances...
                                </td>
                            </tr>
                        )}

                        {!isLoading && rows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-6 text-center text-sm text-slate-500"
                                >
                                    No insurances yet.
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            rows.map((row) => {
                                const insurance = row.insurance;

                                return (
                                    <tr key={row.key}>
                                        <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-slate-900">
                                            {row.label}
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-600">
                                            {row.count}
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-600">
                                            ₱{row.total.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                            {insurance && (
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit(insurance)}
                                                        aria-label={`Edit ${row.label}`}
                                                        className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-700"
                                                    >
                                                        <Pencil size={16} strokeWidth={1.8} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={!row.isDeletable}
                                                        onClick={() => onDelete(insurance)}
                                                        aria-label={`Delete ${row.label}`}
                                                        title={
                                                            row.isDeletable
                                                                ? undefined
                                                                : 'Cannot delete: consultations are still billed to this insurance'
                                                        }
                                                        className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                                                    >
                                                        <Trash2 size={16} strokeWidth={1.8} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IN_InsuranceSummaryList;
