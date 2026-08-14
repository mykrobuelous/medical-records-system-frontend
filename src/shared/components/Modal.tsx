// 📦 LIBRARIES IMPORT
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/* ===================================================================== */
/*🧩 MODAL - Generic centered dialog with an overlay*/

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    className?: string;
    children: ReactNode;
}

const Modal: React.FC<Props> = ({ isOpen, onClose, title, className, children }) => {
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/60 p-4"
            onClick={onClose}
        >
            <div
                className={twMerge(
                    'flex max-h-full w-full max-w-lg flex-col rounded-2xl bg-white p-6 shadow-xl',
                    className
                )}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-4 flex shrink-0 items-center justify-between">
                    <h2 className="text-xl font-semibold text-blue-950">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="min-h-0 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
