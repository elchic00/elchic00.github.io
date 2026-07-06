import { useEffect, useState } from "react";
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationIcon } from "@heroicons/react/solid";
import DOMPurify from "dompurify";
import { TIMING } from "../../constants";

interface AlertProps {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
  footer?: string;
  onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, footer, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, TIMING.ALERT_FADE_OUT);
  };

  const iconMap = {
    success: <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" aria-hidden="true" />,
    error: <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" aria-hidden="true" />,
    warning: <ExclamationIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" aria-hidden="true" />,
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-message"
        className={`relative bg-slate-800 rounded-lg shadow-2xl max-w-md w-full p-6 border border-slate-700 transform transition-all duration-200 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {iconMap[type]}

        <h2 id="alert-title" className="text-xl font-bold text-white text-center mb-3">
          {title}
        </h2>

        <p id="alert-message" className="text-slate-300 text-center mb-6">
          {message}
        </p>

        {footer && (
          <div
            className="text-sm text-slate-400 text-center mb-4 border-t border-slate-700 pt-4"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(footer) }}
          />
        )}

        <button
          onClick={handleClose}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded transition-colors focus-ring"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// Hook for managing alerts
export const useAlert = () => {
  const [alert, setAlert] = useState<Omit<AlertProps, "onClose"> | null>(null);

  const fire = (config: Omit<AlertProps, "onClose">) => {
    setAlert(config);
  };

  const close = () => {
    setAlert(null);
  };

  const AlertComponent = alert ? (
    <Alert {...alert} onClose={close} />
  ) : null;

  return { fire, AlertComponent };
};
