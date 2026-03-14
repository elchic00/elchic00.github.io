import { CheckCircleIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import { Modal } from "../shared/Modal";

interface ContactSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSuccessModal: React.FC<ContactSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Message sent successfully"
    >
      <div className="bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/10 sm:mx-0 sm:h-12 sm:w-12">
            <CheckCircleIcon
              className="h-8 w-8 text-emerald-500"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
            <h3
              className="text-2xl font-bold leading-6 text-white mb-2"
              id="modal-title"
            >
              Message Sent Successfully!
            </h3>
            <div className="mt-4">
              <p className="text-base text-slate-300 mb-4">
                Thank you for reaching out! I've received your message and will
                get back to you as soon as possible.
              </p>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-cyan-300 font-medium mb-1">
                  Expected Response Time
                </p>
                <p className="text-sm text-slate-300">
                  I typically respond within{" "}
                  <span className="font-semibold text-cyan-400">
                    24-48 hours
                  </span>{" "}
                  during business days.
                </p>
              </div>
              <p className="text-sm text-slate-400">
                In the meantime, feel free to check out my projects or connect
                with me on LinkedIn!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 sm:w-auto sm:text-sm transition-colors"
          onClick={onClose}
        >
          Got it!
        </button>
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-lg border border-slate-600 shadow-sm px-4 py-2 bg-slate-700 text-base font-medium text-slate-200 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 sm:w-auto sm:text-sm transition-colors"
          onClick={() => {
            navigate("/projects");
            onClose();
          }}
        >
          View Projects
        </button>
      </div>
    </Modal>
  );
};
