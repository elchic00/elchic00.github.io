import { SocialLinks } from "./shared/SocialLinks";
import { MonogramOverlap } from "./shared/MonogramLogo";

export const Footer = () => {
  return (
    <footer className="border-t border-t-gray-600">
      <div className="p-2">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <SocialLinks variant="footer" className="mr-4" />

          {/* Lighthouse Score Badge */}
          <a
            href="https://pagespeed.web.dev/analysis/https-elchic00-github-io/x97fuakj1n?form_factor=desktop"
            target="_blank"
            rel="noopener noreferrer"
            className="my-auto sm:ml-auto sm:mr-4 group flex items-center gap-2 text-sm hover:text-cyan-400 transition-colors duration-200"
            aria-label="View Lighthouse performance report - Perfect 100 score"
          >
            <svg
              className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400 transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2L4.5 20.5l.5.5 7-4 7 4 .5-.5L12 2zm0 2.5l6.5 15-6.5-3.7-6.5 3.7L12 4.5z" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            <span className="hidden sm:inline">Lighthouse: 100/100</span>
            <span className="sm:hidden">Perfect Lighthouse Score</span>
          </a>

          <div className="my-auto sm:ml-0 ml-auto flex items-center gap-2">
            <MonogramOverlap className="w-6 h-6 text-cyan-500" />
            <span>by Andrew Alagna</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
