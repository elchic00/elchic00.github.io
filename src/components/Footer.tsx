import { ServerIcon } from "@heroicons/react/solid";
import { SocialLinks } from "./shared/SocialLinks";
import { MonogramOverlap } from "./shared/MonogramLogo";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/40 bg-slate-950/80 backdrop-blur-md w-full relative z-20 pb-24 md:pb-0">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8 md:gap-0">
          
          {/* LEFT: System Status - md:flex-1 restores the left-pin */}
          <div className="md:flex-1 flex items-center gap-3 justify-center md:justify-start">
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
              <ServerIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold">
                System Status
              </span>
              <span className="text-xs text-slate-300 whitespace-nowrap">
                Vite + React • <span className="text-emerald-400/90 font-medium">100/100</span>
              </span>
            </div>
          </div>

          {/* CENTER: Socials - Stays centered always */}
          <div className="flex justify-center items-center">
            <div className="flex flex-row items-center gap-6 py-2.5 px-8 rounded-full bg-slate-900/40 border border-slate-800/50 shadow-lg">
              <SocialLinks variant="footer" />
            </div>
          </div>

          {/* RIGHT: Identity - md:flex-1 restores the right-pin */}
          <div className="md:flex-1 flex items-center gap-4 justify-center md:justify-end">
            <div className="text-center md:text-right">
              {/* On mobile, we show a simplified copyright line */}
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold block md:hidden">
                © 2026 Andrew Alagna
              </span>
              {/* On desktop, we keep the full stack */}
              <div className="hidden md:block">
                <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold block">
                  Developer
                </span>
                <span className="text-xs text-slate-300">
                  © 2026 Andrew Alagna
                </span>
              </div>
            </div>
            {/* Monogram - Increased size slightly for mobile presence */}
            <MonogramOverlap className="h-7 md:h-8 w-auto text-cyan-400/30 hover:text-cyan-400 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
};