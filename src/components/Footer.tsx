import { ServerIcon } from "@heroicons/react/solid";
import { SocialLinks } from "./shared/SocialLinks";
import { MonogramOverlap } from "./shared/MonogramLogo";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/40 bg-slate-950/80 backdrop-blur-md w-full relative z-20">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-row items-center justify-between">
          
          {/* LEFT: System Status */}
          <div className="flex-1 flex items-center gap-3 justify-start">
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
              <ServerIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold">System Status</span>
              <span className="text-xs text-slate-400 whitespace-nowrap">
                Vite + React • <span className="text-emerald-400/90 font-medium">100/100 Lighthouse</span>
              </span>
            </div>
          </div>

          {/* CENTER: Socials - Forced Horizontal & No Box */}
          <div className="flex-1 flex justify-center items-center">
             <div className="flex flex-row items-center gap-4 py-2 px-6 rounded-full bg-slate-900/30 border border-slate-800/50">
                <SocialLinks variant="footer" />
             </div>
          </div>

          {/* RIGHT: Identity with Cyan Brand Color */}
          <div className="flex-1 flex items-center gap-4 justify-end">
            <div className="text-right hidden md:block">
              <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold block">Developer</span>
              <span className="text-xs text-slate-400">© 2026 Andrew Alagna</span>
            </div>
            {/* The cyan-400 color makes the brand feel alive */}
            <MonogramOverlap className="h-8 w-auto text-cyan-400/40 hover:text-cyan-400 transition-all duration-300" />
          </div>

        </div>
      </div>
    </footer>
  );
};