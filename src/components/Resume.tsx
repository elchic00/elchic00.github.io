import { useEffect } from "react";
import { APP_CONFIG } from "../constants";

const ResumePage = () => {
  const pdfPath = `/${APP_CONFIG.RESUME_FILENAME}`;

  const buttonBaseClasses =
    "inline-block py-3 px-6 rounded font-bold transition-colors duration-150";
  const downloadButtonClasses = `${buttonBaseClasses} bg-cyan-600 hover:bg-cyan-500 text-white mr-3`;
  const openButtonClasses = `${buttonBaseClasses} bg-slate-600 hover:bg-slate-700 text-white`;

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = pdfPath;
    }
  }, [pdfPath]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-600 pt-20">
      <header className="p-5 text-center bg-slate-700 shadow-md">
        <h1 className="text-2xl font-bold text-white mb-4">Resume</h1>

        <nav aria-label="Resume actions">
          <a
            href={pdfPath}
            download="andrew-alagna-resume.pdf"
            className={downloadButtonClasses}
            aria-label="Download resume as PDF"
          >
            Download PDF
          </a>
          <a
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className={openButtonClasses}
            aria-label="Open resume in new tab"
          >
            Open in New Tab
          </a>
        </nav>
      </header>

      <div className="flex-1 min-h-[80vh] hidden md:block">
        <object
          data={pdfPath}
          type="application/pdf"
          width="100%"
          height="100%"
          className="min-h-[80vh]"
          aria-label="Resume PDF viewer"
        >
          <div className="p-10 text-center bg-white m-5 rounded-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Resume Preview Unavailable
            </h2>
            <p className="text-gray-600 mb-4">
              Your browser doesn't support inline PDF viewing.
            </p>
            <a
              href={pdfPath}
              download="andrew-alagna-resume.pdf"
              className={downloadButtonClasses}
            >
              Download PDF Instead
            </a>
          </div>
        </object>
      </div>

      <div className="flex-1 min-h-[80vh] md:hidden">
        <div className="p-10 text-center bg-white m-5 rounded-lg mt-10">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Resume Preview
          </h2>
          <p className="text-gray-600 mb-4">
            For the best experience, please download the PDF or view it in a new
            tab. Inline viewing is not supported on mobile devices.
          </p>
          <a
            href={pdfPath}
            download="andrew-alagna-resume.pdf"
            className={downloadButtonClasses}
          >
            Download Resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
