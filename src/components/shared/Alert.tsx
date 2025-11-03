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
    // Trigger animation
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, TIMING.ALERT_FADE_OUT); // Wait for fade out animation
  };

  const iconMap = {
    success: <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />,
    error: <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />,
    warning: <ExclamationIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />,
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Alert Box */}
      <div
        className={`relative bg-slate-800 rounded-lg shadow-2xl max-w-md w-full p-6 border border-slate-700 transform transition-all duration-200 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {iconMap[type]}

        <h2 className="text-xl font-bold text-white text-center mb-3">
          {title}
        </h2>

        <p className="text-slate-300 text-center mb-6">
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
