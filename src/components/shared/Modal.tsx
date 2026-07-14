import { ReactNode, useEffect, useRef } from "react";
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const scrollYRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        previouslyFocusedRef.current?.focus();
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Move focus into the modal on open, trap Tab within it, and restore
  // focus to the trigger element on close.
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Focus the dialog container itself, not "the first focusable element" —
    // DOM order doesn't always match visual/safety order (e.g. ConfirmDialog
    // puts its destructive button before Cancel to control layout), so
    // guessing which control to jump to risks auto-focusing a dangerous action.
    containerRef.current?.focus();

    const handleTab = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (e.key !== "Tab" || !container) return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    // Focus restoration on close happens synchronously in each close handler
    // below (Escape, backdrop click, close button) instead of here — this
    // cleanup runs after React's commit, outside the closing click/keydown's
    // event-handler stack, which made Chrome treat the restored focus as
    // script-initiated and show a focus-visible ring even for mouse closes.
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  useEffect(() => {
  if (isOpen) {
    // Capture scroll position before locking
    scrollYRef.current = window.scrollY;
    
    // Apply styles to body
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "scroll";
  } else {
    // 1. Grab the current top value from the body just in case the ref is stale
    const scrollY = document.body.style.top;
    
    // 2. TEMPORARILY DISABLE SMOOTH SCROLLING
    const html = document.documentElement;
    html.style.scrollBehavior = 'auto'; // Force instant jump

    // 3. Reset body styles
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.overflowY = "";

    // 4. Perform the instant scroll
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    } else {
      window.scrollTo(0, scrollYRef.current);
    }

    // 5. Remove the inline override so the global CSS scroll-behavior (smooth)
    // takes back over. Removing (rather than restoring a captured value) keeps
    // this correct even if another Modal instance's effect ran in between.
    // We use requestAnimationFrame to ensure the scroll happens first.
    requestAnimationFrame(() => {
      html.style.removeProperty('scroll-behavior');
    });
  }

  return () => {
    // Basic style cleanup
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
        onClick={closeOnBackdropClick ? () => { previouslyFocusedRef.current?.focus(); onClose(); } : undefined}
      />

      {/* Modal Container: This handles its own internal scroll */}
      <div
        ref={containerRef}
        tabIndex={-1}
        className={`relative z-[110] w-full ${maxWidthClasses[maxWidth]} mx-4 max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-700 shadow-xl animate-slide-up overscroll-contain focus:outline-none`}
      >
        {showCloseButton && (
          <button
            type="button"
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20"
            onClick={() => { previouslyFocusedRef.current?.focus(); onClose(); }}
            aria-label="Close modal"
          >
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};