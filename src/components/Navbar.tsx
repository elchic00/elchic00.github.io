import { useState, useCallback, useEffect } from "react";
import {
  ArrowRightIcon,
  MenuIcon,
  XIcon,
  BriefcaseIcon,
  CodeIcon,
  ChipIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  PuzzleIcon,
  ChatAlt2Icon,
} from "@heroicons/react/solid";
import { useLocation } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { useClickOutside, useWindowSize } from "../hooks";
import { NAV_LINKS, scrollWithOffset, TIMING } from "../constants";
import { MonogramOverlap } from "./shared/MonogramLogo";
import { trackResumeView } from "../utils/analytics";

export const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const { width } = useWindowSize(TIMING.NAVBAR_DEBOUNCE);
  const isMobile = width < 1024;

  // REORDERED NAV: Experience -> Skills -> Projects -> Resume -> Travel
  const orderedLinks = [...NAV_LINKS].sort((a, b) => {
    const order = ["Experience", "Skills", "Projects", "Resume", "Travel"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  const getNavIcon = (name: string) => {
    const iconClass = "w-5 h-5 mr-2.5";
    switch (name) {
      case "Experience": return <BriefcaseIcon className={iconClass} />;
      case "Projects": return <CodeIcon className={iconClass} />;
      case "Skills": return <ChipIcon className={iconClass} />;
      case "Resume": return <DocumentTextIcon className={iconClass} />;
      case "Travel": return <GlobeAltIcon className={iconClass} />;
      case "Snake": return <PuzzleIcon className={iconClass} />;
      default: return null;
    }
  };

  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);
  const navRef = useClickOutside(closeMenu);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      const allSectionIds = [
        ...NAV_LINKS.map((link) => link.link.split("#")[1]).filter(Boolean),
        "contact",
      ];
      const sections = allSectionIds.map((id) => document.getElementById(id)).filter(Boolean);
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(`#${section.id}`);
          return;
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobile && open) closeMenu();
    // Prevent background scrolling when menu is open
    document.body.style.overflow = open ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobile, open, closeMenu]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, linkPath: string, linkName: string) => {
      if (linkName === "Resume") {
        e.preventDefault();
        trackResumeView();
        window.open("/andrew-alagna-resume.pdf", "_blank", "noopener,noreferrer");
        closeMenu();
        return;
      }
      const targetRoute = linkPath.startsWith("/#") ? "/" : linkPath;
      if (location.pathname === targetRoute && !linkPath.includes("#")) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      closeMenu();
    },
    [closeMenu, location.pathname]
  );

  return (
    <nav
      ref={navRef}
      className="bg-slate-800/95 backdrop-blur-md shadow-lg w-full fixed top-0 left-0 z-50 border-b border-slate-700/50"
      aria-label="Main navigation"
    >
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="flex justify-between items-center py-3 px-4 lg:px-12 max-w-[1600px] mx-auto">
        <Link
          to="/#about"
          scroll={scrollWithOffset}
          className="font-bold text-xl cursor-pointer inline-flex items-center font-[Poppins] text-slate-200 hover:text-white transition-all focus-ring whitespace-nowrap group border border-transparent hover:border-cyan-500/30 px-2 py-1 rounded-lg"
          onClick={(e) => handleLinkClick(e, "/#about", "Home")}
          title="Back to Home"
        >
          <MonogramOverlap className="w-8 h-8 lg:w-9 lg:h-9 text-cyan-500 mr-2 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline tracking-tight">Andrew Alagna</span>
        </Link>

        {isMobile && (
          <button
            onClick={toggleMenu}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-200 active:scale-95 transition-all"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="text-xs font-bold uppercase tracking-wider">{open ? "Close" : "Menu"}</span>
            {open ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        )}

        {/* MOBILE DRAWER - Made Opaque to fix the double-text issue */}
        {isMobile && (
          <div
            className={`absolute left-0 w-full h-[calc(100vh-68px)] overflow-y-auto bg-slate-900 transition-all duration-300 ease-in-out z-40 ${open ? "top-[68px] opacity-100 translate-x-0" : "top-[68px] opacity-0 -translate-x-full"
              }`}
          >
            <div className="px-6 py-8 flex flex-col h-full bg-slate-900">
              <div className="mb-8 p-4 bg-gradient-to-br from-cyan-900/40 to-slate-800 rounded-2xl border border-cyan-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <ChatAlt2Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="font-bold text-slate-100 text-sm">Ask my AI anything about me</span>
                </div>
                <button
                  onClick={() => {
                    closeMenu();
                    window.dispatchEvent(new CustomEvent("openAIChat"));
                  }}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Start Conversation
                </button>
              </div>

              <ul className="grid grid-cols-1 gap-2">
                {orderedLinks.map((link, index) => {
                  const linkHash = link.link.includes("#") ? `#${link.link.split("#")[1]}` : "";
                  const isActive = (linkHash && activeSection === linkHash) || (location.pathname === link.link);
                  return (
                    <li key={link.name} style={{ transitionDelay: `${index * 50}ms` }} className={`${open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} transition-all duration-300`}>
                      <Link
                        to={link.link}
                        scroll={scrollWithOffset}
                        className={`flex items-center p-4 rounded-xl text-lg font-medium transition-all ${isActive ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-slate-300 active:bg-slate-700"
                          }`}
                        onClick={(e) => handleLinkClick(e, link.link, link.name)}
                      >
                        <span className={`p-2 rounded-lg mr-4 ${isActive ? 'bg-cyan-500/20' : 'bg-slate-700'}`}>
                          {getNavIcon(link.name)}
                        </span>
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto pb-10">
                <Link
                  to="/#contact"
                  className="block w-full py-4 bg-purple-600 text-white text-center rounded-xl font-bold text-lg"
                  onClick={(e) => handleLinkClick(e, "/#contact", "Contact")}
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center flex-1 justify-end">
          <ul className="flex items-center space-x-2 mr-6">
            {orderedLinks.map((link) => {
              const linkHash = link.link.includes("#") ? `#${link.link.split("#")[1]}` : "";
              const isActive = (linkHash && activeSection === linkHash) || (location.pathname === link.link);

              return (
                <li key={link.name}>
                  <Link
                    to={link.link}
                    scroll={scrollWithOffset}
                    className={`px-3 py-1.5 rounded-md text-sm xl:text-base font-medium transition-all duration-300 border border-transparent hover:border-cyan-500/50 hover:text-white ${isActive ? "text-cyan-400 bg-cyan-500/10 !border-cyan-500/30" : "text-slate-300"
                      }`}
                    onClick={(e) => handleLinkClick(e, link.link, link.name)}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="pl-6 border-l border-slate-700/50">
            <Link
              to="/#contact"
              className={`flex items-center px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${activeSection === "#contact"
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/40 scale-105"
                  : "bg-purple-700/80 text-slate-100 hover:bg-purple-600 hover:text-white hover:scale-105"
                }`}
            >
              Contact
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};