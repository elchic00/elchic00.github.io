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
  UserGroupIcon,
} from "@heroicons/react/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { useClickOutside, useWindowSize } from "../hooks";
import { NAV_LINKS, scrollWithOffset, TIMING } from "../constants";
import { MonogramOverlap } from "./shared/MonogramLogo";
import { trackResumeView } from "../utils/analytics";

const getNavIconBg = (name: string) => {
  switch (name) {
    case "Accessibility": return "bg-cyan-500/20 text-cyan-400";
    case "Experience": return "bg-blue-500/20 text-blue-400";
    case "Projects": return "bg-red-500/20 text-red-400";
    case "Skills": return "bg-yellow-500/20 text-yellow-400";
    case "Resume": return "bg-purple-500/20 text-purple-400";
    case "Travel": return "bg-orange-500/20 text-orange-400";
    case "Snake": return "bg-green-500/20 text-green-400";
    default: return "bg-slate-700 text-slate-400";
  }
};

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const { width } = useWindowSize(TIMING.NAVBAR_DEBOUNCE);
  const isMobile = width < 1024;

  const getNavIcon = (name: string) => {
    const iconClass = "w-5 h-5";
    switch (name) {
      case "Accessibility": return <UserGroupIcon className={iconClass} />;
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
      const sections = allSectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);
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
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.style.overflowX = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflowX = "";
    };
  }, [isMobile, open, closeMenu]);

  const handleSnakeClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (location.pathname === "/snake") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/snake");
      }
      closeMenu();
    },
    [navigate, closeMenu, location.pathname]
  );

  const handleLinkClick = useCallback(
    (
      e: React.MouseEvent<HTMLAnchorElement>,
      linkPath: string,
      linkName: string
    ) => {
      if (linkName === "Resume") {
        e.preventDefault();
        trackResumeView();
        window.open(
          "/andrew-alagna-resume.pdf",
          "_blank",
          "noopener,noreferrer"
        );
        closeMenu();
        return;
      }
      const targetRoute = linkPath.startsWith("/#") ? "/" : linkPath;
      if (
        location.pathname === targetRoute &&
        !linkPath.includes("#")
      ) {
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
      {/* Scroll progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="flex justify-between items-center py-3 px-4 lg:px-12 max-w-[1600px] mx-auto">
        {/* Logo */}
        <Link
          to="/#about"
          scroll={scrollWithOffset}
          aria-label="Andrew Alagna - Home"
          className={`font-bold text-xl cursor-pointer inline-flex items-center font-[Poppins] transition-all focus-ring whitespace-nowrap group px-2 py-1 rounded-lg border ${activeSection === "" || activeSection === "#about"
              ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
              : "text-slate-200 hover:text-white border-transparent hover:border-cyan-500/30"
            }`}
          onClick={(e) => handleLinkClick(e, "/#about", "Home")}
        >
          <MonogramOverlap
            className={`w-8 h-8 lg:w-9 lg:h-9 mr-2 group-hover:scale-110 transition-transform ${activeSection === "" || activeSection === "#about"
                ? "text-cyan-400"
                : "text-cyan-500"
              }`}
          />
          <span className="hidden sm:inline tracking-tight">
            Andrew Alagna
          </span>
        </Link>

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={toggleMenu}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-200 active:scale-95 transition-all"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="text-xs font-bold uppercase tracking-wider">
              {open ? "Close" : "Menu"}
            </span>
            {open ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        )}

        {/* Mobile menu panel */}
        {isMobile && (
          <div
            className={`fixed left-0 w-screen h-[calc(100vh-68px)] overflow-y-auto bg-slate-900 transition-all duration-300 ease-in-out z-40 ${open
                ? "top-[68px] opacity-100 translate-x-0"
                : "top-[68px] opacity-0 -translate-x-full pointer-events-none"
              }`}
            aria-hidden={!open}
          >
            <div className="px-4 py-4 flex flex-col h-full">

              {/* AI Chat card — tighter spacing */}
              <div className="mb-3 p-2.5 bg-slate-800/80 rounded-xl flex items-center gap-3 border border-slate-700/60">
                <div className="p-1.5 bg-cyan-500/20 rounded-lg shrink-0">
                  <ChatAlt2Icon className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-slate-400 text-s flex-1">
                  Ask my AI anything about me
                </span>
                <button
                  onClick={() => {
                    closeMenu();
                    window.dispatchEvent(new CustomEvent("openAIChat"));
                  }}
                  className="shrink-0 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Chat
                </button>
              </div>

              {/* Nav links — unified container for cohesion */}
              <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-2 flex-1">
                <ul className="grid grid-cols-1 gap-1">
                  {NAV_LINKS.map((link, index) => {
                    const linkHash = link.link.includes("#")
                      ? `#${link.link.split("#")[1]}`
                      : "";
                    const isActive =
                      (linkHash && activeSection === linkHash) ||
                      location.pathname === link.link;
                    const iconColors = getNavIconBg(link.name);

                    return (
                      <li
                        key={link.name}
                        style={{ transitionDelay: `${index * 40}ms` }}
                        className={`transition-all duration-300 ${open
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4"
                          }`}
                      >
                        <Link
                          to={link.link}
                          scroll={scrollWithOffset}
                          className={`flex items-center px-3 py-3.5 rounded-xl text-base font-medium transition-all ${isActive
                              ? "bg-slate-700/60 text-cyan-400 border-l-4 border-cyan-400 pl-2"
                              : "text-slate-300 hover:bg-slate-700/40 hover:text-white"
                            }`}
                          onClick={(e) =>
                            handleLinkClick(e, link.link, link.name)
                          }
                        >
                          <span
                            className={`p-1.5 rounded-lg mr-3 shrink-0 ${isActive ? iconColors : "bg-slate-700/80 text-slate-400"
                              }`}
                          >
                            {getNavIcon(link.name)}
                          </span>
                          {link.name}
                        </Link>
                      </li>
                    );
                  })}

                  {/* Snake */}
                  <li
                    style={{
                      transitionDelay: `${NAV_LINKS.length * 40}ms`,
                    }}
                    className={`transition-all duration-300 ${open
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4"
                      }`}
                  >
                    <button
                      onClick={handleSnakeClick}
                      className={`flex items-center w-full px-3 py-3.5 rounded-xl text-base font-medium transition-all ${location.pathname === "/snake"
                          ? "bg-slate-700/60 text-cyan-400 border-l-4 border-cyan-400 pl-2"
                          : "text-slate-300 hover:bg-slate-700/40 hover:text-white"
                        }`}
                    >
                      <span
                        className={`p-1.5 rounded-lg mr-3 shrink-0 ${location.pathname === "/snake"
                            ? getNavIconBg("Snake")
                            : "bg-slate-700/80 text-slate-400"
                          }`}
                      >
                        {getNavIcon("Snake")}
                      </span>
                      Snake
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact button — more separation + padding for FAB */}
              <div className="mt-4 pb-20">
                <Link
                  to="/#contact"
                  className="block w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-center rounded-xl font-bold text-base shadow-lg shadow-purple-500/20 transition-all"
                  onClick={(e) =>
                    handleLinkClick(e, "/#contact", "Contact")
                  }
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center flex-1 justify-end">
          <ul className="flex items-center space-x-2 mr-6">
            {NAV_LINKS.map((link) => {
              const linkHash = link.link.includes("#")
                ? `#${link.link.split("#")[1]}`
                : "";
              const isActive =
                (linkHash && activeSection === linkHash) ||
                location.pathname === link.link;

              return (
                <li key={link.name}>
                  <Link
                    to={link.link}
                    scroll={scrollWithOffset}
                    className={`px-3 py-1.5 rounded-md text-base xl:text-lg font-medium transition-all duration-300 border border-transparent hover:border-cyan-500/50 hover:text-white ${isActive
                        ? "text-cyan-400 bg-cyan-500/10 !border-cyan-500/30"
                        : "text-slate-300"
                      }`}
                    onClick={(e) =>
                      handleLinkClick(e, link.link, link.name)
                    }
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={handleSnakeClick}
                className={`px-3 py-1.5 rounded-md text-base xl:text-lg font-medium transition-all duration-300 border border-transparent hover:border-cyan-500/50 hover:text-white ${location.pathname === "/snake"
                    ? "text-cyan-400 bg-cyan-500/10 !border-cyan-500/30"
                    : "text-slate-300"
                  }`}
              >
                Snake
              </button>
            </li>
          </ul>

          <div className="pl-6 border-l border-slate-700/50">
            <Link
              to="/#contact"
              className={`flex items-center px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${activeSection === "#contact"
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/40 scale-105"
                  : "bg-purple-700/80 text-slate-100 hover:bg-purple-600 hover:text-white hover:scale-105"
                }`}
              onClick={(e) =>
                handleLinkClick(e, "/#contact", "Contact")
              }
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
