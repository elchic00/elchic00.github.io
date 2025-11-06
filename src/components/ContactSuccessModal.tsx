import { CheckCircleIcon, XIcon } from "@heroicons/react/solid";

interface ContactSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSuccessModal: React.FC<ContactSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-slate-900 dark:bg-slate-900 light:bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-700 dark:border-slate-700 light:border-slate-200">
          <div className="bg-slate-900 dark:bg-slate-900 light:bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/10 sm:mx-0 sm:h-12 sm:w-12">
                <CheckCircleIcon className="h-8 w-8 text-emerald-500" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3
                  className="text-2xl font-bold leading-6 text-white dark:text-white light:text-gray-900 mb-2"
                  id="modal-title"
                >
                  Message Sent Successfully!
                </h3>
                <div className="mt-4">
                  <p className="text-base text-slate-300 dark:text-slate-300 light:text-slate-700 mb-4">
                    Thank you for reaching out! I've received your message and will get back to you as soon as possible.
                  </p>
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-cyan-300 dark:text-cyan-300 light:text-cyan-700 font-medium mb-1">
                      Expected Response Time
                    </p>
                    <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      I typically respond within <span className="font-semibold text-cyan-400 dark:text-cyan-400 light:text-cyan-600">24-48 hours</span> during business days.
                    </p>
                  </div>
                  <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                    In the meantime, feel free to check out my projects or connect with me on LinkedIn!
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="absolute top-4 right-4 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
                onClick={onClose}
                aria-label="Close modal"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="bg-slate-800 dark:bg-slate-800 light:bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              onClick={onClose}
            >
              Got it!
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-600 dark:border-slate-600 light:border-slate-300 shadow-sm px-4 py-2 bg-slate-700 dark:bg-slate-700 light:bg-white text-base font-medium text-slate-200 dark:text-slate-200 light:text-slate-900 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
              onClick={() => {
                window.location.hash = "#projects";
                onClose();
              }}
            >
              View Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
