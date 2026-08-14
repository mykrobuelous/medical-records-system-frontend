// 📦 LIBRARIES IMPORT
import Modal from './Modal';
import Button from './Button';

/* ===================================================================== */
/*🧩 CONFIRM DIALOG - Generic confirmation modal for destructive actions*/

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    isConfirming?: boolean;
}

const ConfirmDialog: React.FC<Props> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    isConfirming = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="text-base text-slate-600">{description}</p>

            <div className="mt-6 flex justify-end gap-3">
                <Button
                    type="button"
                    label="Cancel"
                    variant="ghost"
                    className="w-auto"
                    onClick={onClose}
                    disabled={isConfirming}
                />
                <Button
                    type="button"
                    label={isConfirming ? 'Please wait...' : confirmLabel}
                    className="w-auto bg-red-600 hover:bg-red-700"
                    disabled={isConfirming}
                    onClick={onConfirm}
                />
            </div>
        </Modal>
    );
};

export default ConfirmDialog;
