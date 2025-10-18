import { SocialLinks } from "./shared/SocialLinks";
import { MonogramOverlap } from "./shared/MonogramLogo";

export const Footer = () => {
  return (
    <footer className="border-t border-t-gray-400">
      <div className="p-2">
        <div className="flex">
          <SocialLinks variant="footer" className="mr-4" />
          <div className="my-auto ml-auto flex items-center gap-2">
            <MonogramOverlap className="w-6 h-6 text-cyan-500" />
            <span>by Andrew Alagna</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
