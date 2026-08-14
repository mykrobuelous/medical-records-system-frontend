// 📦 LIBRARIES IMPORT
import React, { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/* ===================================================================== */
/*🧩 INPUT - Generic Input of the project*/

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    label?: string;
    error?: string;
    Icon?: LucideIcon;
}

const Input = forwardRef<HTMLInputElement, Props>(
    ({ className, label, error, Icon, ...props }, ref) => {
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

                <div className="relative">
                    {Icon && (
                        <Icon
                            size={18}
                            strokeWidth={1.8}
                            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-blue-400"
                        />
                    )}

                    <input
                        {...props}
                        ref={ref}
                        className={twMerge(
                            'w-full rounded-lg border border-blue-200 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                            Icon && 'pl-11'
                        )}
                    />
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
