import { ExclamationIcon } from "@heroicons/react/solid";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "neutral";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: {
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    warning: {
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    },
    info: {
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      button: "bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500",
    },
    neutral: {
      iconBg: "bg-slate-500/10",
      iconColor: "text-slate-400",
      button: "bg-slate-600 hover:bg-slate-500 focus:ring-slate-500",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      ariaLabel={title}
      showCloseButton={false}
    >
      <div className="bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div
            className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}
          >
            <ExclamationIcon
              className={`h-6 w-6 ${styles.iconColor}`}
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              className="text-lg font-semibold leading-6 text-white"
              id="modal-title"
            >
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-slate-300">{message}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-800 px-4 py-3 sm:px-6 flex flex-col-reverse sm:flex-row-reverse gap-3">
        <button
          type="button"
          className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 sm:w-auto sm:text-sm transition-colors ${styles.button}`}
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-lg border border-slate-600 shadow-sm px-4 py-2 bg-slate-700 text-base font-medium text-slate-200 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 sm:w-auto sm:text-sm transition-colors"
          onClick={onClose}
        >
          {cancelText}
        </button>
      </div>
    </Modal>
  );
};
