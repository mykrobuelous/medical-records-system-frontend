// 📦 LIBRARIES IMPORT
import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

/* ===================================================================== */
/*🧩 TEXTAREA - Generic Textarea of the project*/

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
    label?: string;
    error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
    ({ className, label, error, rows = 3, ...props }, ref) => {
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

                <textarea
                    {...props}
                    ref={ref}
                    rows={rows}
                    className="w-full rounded-lg border border-blue-200 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;
