import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ArrowRightIcon,
  MenuIcon,
  XIcon,
  ChatAlt2Icon,
} from "@heroicons/react/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { useClickOutside, useWindowSize } from "../hooks";
import {
  NAV_ITEMS,
  CONTACT_CTA,
  scrollWithOffset,
  TIMING,
  getLinkHash,
  isScrollLink,
  type NavItem,
} from "../constants";
import { MonogramOverlap } from "./shared/MonogramLogo";
import { trackResumeView } from "../utils/analytics";

// Local constants
const RESUME_URL = "/andrew-alagna-resume.pdf";
const LOGO_LINK = "/#about";
const LOGO_SECTION = "#about";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const { width } = useWindowSize(TIMING.NAVBAR_DEBOUNCE);
  const isMobile = width < 1024;

  // Memoized section IDs for scroll spy
  const sectionIds = useMemo(
    () => [
      ...NAV_ITEMS.filter((item) => isScrollLink(item.link)).map((item) =>
        getLinkHash(item.link)
      ),
      getLinkHash(CONTACT_CTA.link),
    ],
    []
  );

  // Handlers
  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);
  const navRef = useClickOutside(closeMenu);

  // Handle resume click - external PDF
  const handleResumeClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      trackResumeView();
      window.open(RESUME_URL, "_blank", "noopener,noreferrer");
      closeMenu();
    },
    [closeMenu]
  );

  // Handle snake/game navigation
  const handleGameClick = useCallback(
    (e: React.MouseEvent, link: string) => {
      e.preventDefault();
      if (location.pathname === link) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(link);
      }
      closeMenu();
    },
    [navigate, closeMenu, location.pathname]
  );

  // Handle scroll-to-section links
  const handleScrollLinkClick = useCallback(
    (e: React.MouseEvent, link: string) => {
      const targetRoute = isScrollLink(link) ? "/" : link;
      if (location.pathname === targetRoute && !link.includes("#")) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      closeMenu();
    },
    [closeMenu, location.pathname]
  );

  // Unified link click handler
  const handleLinkClick = useCallback(
    (e: React.MouseEvent, item: NavItem) => {
      switch (item.type) {
        case "external":
          handleResumeClick(e);
          break;
        case "route":
          handleGameClick(e, item.link);
          break;
        case "scroll":
        default:
          handleScrollLinkClick(e, item.link);
          break;
      }
    },
    [handleResumeClick, handleGameClick, handleScrollLinkClick]
  );

  // Handle logo click
  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      if (location.pathname === "/" && !LOGO_LINK.includes("#")) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      closeMenu();
    },
    [closeMenu, location.pathname]
  );

  // Handle contact CTA click
  const handleContactClick = useCallback(
    (e: React.MouseEvent) => {
      void e;
      if (location.pathname === "/") {
        // Let HashLink handle scrolling
        closeMenu();
      } else {
        // Navigate to home with hash
        navigate(CONTACT_CTA.link);
        closeMenu();
      }
    },
    [closeMenu, location.pathname, navigate]
  );

  // Open AI chat from mobile menu
  const handleOpenChat = useCallback(() => {
    closeMenu();
    window.dispatchEvent(new CustomEvent("openAIChat"));
  }, [closeMenu]);

  // Scroll spy for active section
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      const sections = sectionIds
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
  }, [sectionIds]);

  // Mobile menu body scroll lock
  useEffect(() => {
    if (!isMobile && open) closeMenu();
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.style.overflowX = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflowX = "";
    };
  }, [isMobile, open, closeMenu]);

  // Helper to check if a nav item is active
  const isItemActive = useCallback(
    (item: NavItem): boolean => {
      const linkHash = getLinkHash(item.link);
      return (
        (linkHash && activeSection === linkHash) ||
        location.pathname === item.link
      );
    },
    [activeSection, location.pathname]
  );

  // Helper to check if logo is active
  const isLogoActive =
    activeSection === "" || activeSection === LOGO_SECTION;

  // Helper to check if contact is active
  const isContactActive = activeSection === getLinkHash(CONTACT_CTA.link);

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
          to={LOGO_LINK}
          scroll={scrollWithOffset}
          aria-label="Andrew Alagna - Home"
          className={`font-bold text-xl cursor-pointer inline-flex items-center font-[Poppins] transition-all focus-ring whitespace-nowrap px-2 py-1 rounded-lg border ${
            isLogoActive
              ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
              : "text-slate-200 hover:text-white border-transparent hover:border-cyan-500/30"
          }`}
          onClick={handleLogoClick}
        >
          <MonogramOverlap
            className={`w-8 h-8 lg:w-9 lg:h-9 mr-2 transition-transform group-hover:scale-110 ${
              isLogoActive ? "text-cyan-400" : "text-cyan-500"
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
            className={`fixed left-0 w-screen h-[calc(100vh-68px)] overflow-y-auto bg-slate-900 transition-all duration-300 ease-in-out z-40 ${
              open
                ? "top-[68px] opacity-100 translate-x-0"
                : "top-[68px] opacity-0 -translate-x-full pointer-events-none"
            }`}
            aria-hidden={!open}
          >
            <div className="px-4 py-4 flex flex-col h-full">
              {/* AI Chat card */}
              <div className="mb-3 p-2.5 bg-slate-800/80 rounded-xl flex items-center gap-3 border border-slate-700/60">
                <div className="p-1.5 bg-cyan-500/20 rounded-lg shrink-0">
                  <ChatAlt2Icon className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-slate-400 text-s flex-1">
                  Ask my AI anything about me
                </span>
                <button
                  onClick={handleOpenChat}
                  className="shrink-0 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Chat
                </button>
              </div>

              {/* Nav links */}
              <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-2 flex-1">
                <ul className="grid grid-cols-1 gap-1">
                  {NAV_ITEMS.map((item, index) => {
                    const active = isItemActive(item);
                    const Icon = item.icon;

                    return (
                      <li
                        key={item.name}
                        style={{ transitionDelay: `${index * 40}ms` }}
                        className={`transition-all duration-300 ${
                          open
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4"
                        }`}
                      >
                        <Link
                          to={item.link}
                          scroll={scrollWithOffset}
                          className={`flex items-center px-3 py-3.5 rounded-xl text-base font-medium transition-all ${
                            active
                              ? "bg-slate-700/60 text-cyan-400 border-l-4 border-cyan-400 pl-2"
                              : "text-slate-300 hover:bg-slate-700/40 hover:text-white"
                          }`}
                          onClick={(e) => handleLinkClick(e, item)}
                        >
                          <span
                            className={`p-1.5 rounded-lg mr-3 shrink-0 ${
                              active ? item.iconBg : "bg-slate-700/80 text-slate-400"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </span>
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Contact button */}
              <div className="mt-4 pb-20">
                <Link
                  to={CONTACT_CTA.link}
                  className="block w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-center rounded-xl font-bold text-base shadow-lg shadow-purple-500/20 transition-all"
                  onClick={handleContactClick}
                >
                  {CONTACT_CTA.name} Me
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center flex-1 justify-end">
          <ul className="flex items-center space-x-2 mr-6">
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item);

              return (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    scroll={scrollWithOffset}
                    className={`px-3 py-1.5 rounded-md text-base xl:text-lg font-medium transition-all duration-300 border border-transparent hover:border-cyan-500/50 hover:text-white ${
                      active
                        ? "text-cyan-400 bg-cyan-500/10 !border-cyan-500/30"
                        : "text-slate-300"
                    }`}
                    onClick={(e) => handleLinkClick(e, item)}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="pl-6 border-l border-slate-700/50">
            <Link
              to={CONTACT_CTA.link}
              className={`flex items-center px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                isContactActive
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/40 scale-105"
                  : "bg-purple-700/80 text-slate-100 hover:bg-purple-600 hover:text-white hover:scale-105"
              }`}
              onClick={handleContactClick}
            >
              {CONTACT_CTA.name}
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
