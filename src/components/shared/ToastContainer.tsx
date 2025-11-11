/**
 * Toast container that displays toast notifications
 * Renders all active toasts with slide-in animation and auto-dismiss
 */

import { createPortal } from "react-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationIcon,
  XIcon,
} from "@heroicons/react/solid";
import { useToast, Toast } from "../../contexts/ToastContext";

const TOAST_ICONS = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationIcon,
};

const TOAST_STYLES = {
  success: "bg-green-600 border-green-500",
  error: "bg-red-600 border-red-500",
  info: "bg-blue-600 border-blue-500",
  warning: "bg-yellow-600 border-yellow-500",
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem = ({ toast, onDismiss }: ToastItemProps) => {
  const Icon = TOAST_ICONS[toast.type];
  const styles = TOAST_STYLES[toast.type];

  return (
    <div
      className={`flex items-start gap-3 ${styles} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-[300px] max-w-md animate-slide-in`}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 hover:bg-white/20 rounded p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Dismiss notification"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className="fixed top-4 right-4 z-[200] flex flex-col gap-2"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={hideToast} />
      ))}
    </div>,
    document.body
  );
};
