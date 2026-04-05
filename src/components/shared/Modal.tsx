import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "@heroicons/react/solid";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  ariaLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  maxWidth = "lg",
  ariaLabel = "Modal dialog",
}) => {
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Force the body to stay put
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll"; // Keep scrollbar space to prevent jumping
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-4xl",
    "2xl": "sm:max-w-6xl",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      {/* Backdrop: touch-action: none prevents touch-based scrolling on mobile */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-fade-in touch-none"
        aria-hidden="true"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />

      {/* Modal Container: This handles its own internal scroll */}
      <div
        className={`relative z-[110] w-full ${maxWidthClasses[maxWidth]} mx-4 max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-700 shadow-xl animate-slide-up overscroll-contain`}
      >
        {showCloseButton && (
          <button
            type="button"
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20"
            onClick={onClose}
            aria-label="Close modal"
          >
            <XIcon className="h-6 w-6" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};