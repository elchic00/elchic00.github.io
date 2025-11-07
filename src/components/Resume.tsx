import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../constants";

const ResumePage = () => {
  const pdfPath = `/${APP_CONFIG.RESUME_FILENAME}`;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Resume - Andrew Alagna";
    window.open(pdfPath, "_blank", "noopener,noreferrer");
  }, [pdfPath]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-800">
      <div className="text-center p-8">
        <div className="mb-6">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Opening Resume...
        </h1>
        <p className="text-slate-300 mb-6">
          Your resume will open in a new tab
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href={pdfPath}
            download="andrew-alagna-resume.pdf"
            className="inline-block py-2 px-6 rounded font-bold transition-colors duration-150 bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            Download PDF
          </a>
          <button
            onClick={() => navigate("/")}
            className="inline-block py-2 px-6 rounded font-bold transition-colors duration-150 bg-slate-600 hover:bg-slate-700 text-white"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
