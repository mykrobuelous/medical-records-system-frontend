// 📦 LIBRARIES IMPORT
import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

/* ===================================================================== */
/*🧩 SELECT - Generic Select of the project*/

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
    className?: string;
    label?: string;
    error?: string;
}

const Select = forwardRef<HTMLSelectElement, Props>(
    ({ className, label, error, children, ...props }, ref) => {
        return (
            <div className={twMerge('', className)}>
                {label && (
                    <label
                        htmlFor={props.name}
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        {label}
                    </label>
                )}

                <select
                    {...props}
                    ref={ref}
                    className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                    {children}
                </select>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
