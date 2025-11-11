import { useState, useCallback, useEffect } from "react";
import {
  ArrowRightIcon,
  MenuIcon,
  XIcon,
  BriefcaseIcon,
  CodeIcon,
  LightningBoltIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  SparklesIcon,
} from "@heroicons/react/solid";
import { useNavigate, useLocation } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { useClickOutside, useWindowSize } from "../hooks";
import { NAV_LINKS, scrollWithOffset, TIMING } from "../constants";
import { MonogramOverlap } from "./shared/MonogramLogo";
import { SocialLinks } from "./shared/SocialLinks";
import { trackResumeView } from "../utils/analytics";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const { width } = useWindowSize(TIMING.NAVBAR_DEBOUNCE);
  const isMobile = width < 1024;

  // Icon mapping for navigation items
  const getNavIcon = (name: string) => {
    const iconClass = "w-5 h-5 mr-2.5";
    switch (name) {
      case "Experience":
        return <BriefcaseIcon className={iconClass} />;
      case "Projects":
        return <CodeIcon className={iconClass} />;
      case "Skills":
        return <LightningBoltIcon className={iconClass} />;
      case "Resume":
        return <DocumentTextIcon className={iconClass} />;
      case "Travel":
        return <GlobeAltIcon className={iconClass} />;
      case "Snake":
        return <SparklesIcon className={iconClass} />;
      default:
        return null;
    }
  };

  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);

  const navRef = useClickOutside(closeMenu);

  useEffect(() => {
    if (!isMobile && open) {
      closeMenu();
    }
  }, [isMobile, open, closeMenu]);

  useEffect(() => {
    const handleScroll = () => {
      // Include all hash sections, including contact which isn't in NAV_LINKS
      const allSectionIds = [
        ...NAV_LINKS.map((link) => link.link.split("#")[1]).filter(Boolean),
        "contact", // Add contact section for scroll detection
      ];

      const sections = allSectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(`#${section.id}`);
          return;
        }
      }
      setActiveSection("");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        e?.currentTarget?.blur?.();
        return;
      }

      const targetRoute = linkPath.startsWith("/#") ? "/" : linkPath;
      const hasHash = linkPath.includes("#");

      if (location.pathname === targetRoute && !hasHash) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      closeMenu();
      e?.currentTarget?.blur?.();
    },
    [closeMenu, location.pathname]
  );

  const handleSnakeClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (location.pathname === "/snake") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/snake");
      }
      closeMenu();
      e?.currentTarget?.blur?.();
    },
    [navigate, closeMenu, location.pathname]
  );

  return (
    <nav
      ref={navRef}
      className="bg-slate-800/95 backdrop-blur-md shadow-lg w-full fixed top-0 left-0 z-50"
      aria-label="Main navigation"
    >
      <div className="flex justify-between items-center py-3 px-4 lg:px-8">
        <Link
          to="/#about"
          scroll={scrollWithOffset}
          className="font-bold text-xl lg:text-2xl cursor-pointer inline-flex items-center font-[Poppins] text-slate-200 hover:text-white duration-500 border border-transparent hover:border-cyan-500 px-2 py-1 rounded transition-colors focus-ring whitespace-nowrap"
          onClick={(e) => handleLinkClick(e, "/#about", "Home")}
          aria-label="Andrew Alagna - Home"
        >
          <MonogramOverlap className="w-8 h-8 lg:w-10 lg:h-10 text-cyan-500 mr-1" />
          <span>Andrew Alagna</span>
        </Link>

        {isMobile && (
          <button
            onClick={toggleMenu}
            className="absolute right-4 top-5 cursor-pointer text-slate-200 hover:text-white focus-ring rounded"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <XIcon className="w-8 h-8" aria-hidden="true" />
            ) : (
              <MenuIcon className="w-8 h-8" aria-hidden="true" />
            )}
          </button>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <div
            className={`absolute left-0 w-full bg-slate-800/95 backdrop-blur-md transition-all duration-300 ease-out z-40 ${
              open ? "top-[68px] opacity-100 visible" : "top-[68px] opacity-0 invisible"
            }`}
          >
            <ul className="w-full px-6 py-4">
              {/* Primary CTA */}
              <li className={`mb-6 transition-all duration-300 ${open ? "translate-y-0 opacity-100 delay-150" : "translate-y-[-10px] opacity-0"}`}>
                <Link
                  to="/#contact"
                  scroll={scrollWithOffset}
                  className={`flex items-center justify-center font-medium py-3.5 px-5 rounded-lg active:scale-95 duration-300 transition-all focus-ring focus:ring-offset-2 focus:ring-offset-slate-800 text-lg ${
                    activeSection === "#contact"
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/40 ring-2 ring-purple-400"
                      : "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600 hover:shadow-lg hover:shadow-purple-500/30 shadow-md shadow-purple-500/25"
                  }`}
                  onClick={(e) => handleLinkClick(e, "/#contact", "Contact")}
                  aria-label="Contact Andrew Alagna"
                >
                  Contact Me
                  <ArrowRightIcon className="w-5 h-5 ml-2" aria-hidden="true" />
                </Link>
              </li>

              {/* Divider */}
              <li className={`border-t border-slate-700 mb-6 transition-all duration-300 ${open ? "translate-y-0 opacity-100 delay-200" : "translate-y-[-10px] opacity-0"}`} aria-hidden="true" />

              {/* Navigation Links */}
              <nav aria-label="Main navigation links">
                {NAV_LINKS.map((link, index) => {
                  const linkHash = link.link.includes("#")
                    ? `#${link.link.split("#")[1]}`
                    : "";
                  const isActive =
                    (linkHash && activeSection === linkHash) ||
                    (location.pathname === link.link && link.link.startsWith("/"));
                  const delays = ['delay-[250ms]', 'delay-300', 'delay-[350ms]', 'delay-[400ms]', 'delay-[450ms]'];
                  return (
                    <li key={link.name} className={`mb-1 transition-all duration-300 ${open ? `translate-y-0 opacity-100 ${delays[index]}` : "translate-y-[-10px] opacity-0"}`}>
                      <Link
                        to={link.link}
                        scroll={scrollWithOffset}
                        className={`flex items-center py-3.5 px-4 rounded-lg transition-all duration-300 text-lg font-medium ${
                          isActive
                            ? "bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400"
                            : "text-slate-200 hover:bg-slate-700/50 hover:text-white active:bg-slate-700"
                        } focus-ring`}
                        onClick={(e) => handleLinkClick(e, link.link, link.name)}
                      >
                        {getNavIcon(link.name)}
                        {link.name}
                      </Link>
                    </li>
                  );
                })}

                <li className={`mb-1 transition-all duration-300 ${open ? "translate-y-0 opacity-100 delay-500" : "translate-y-[-10px] opacity-0"}`}>
                  <button
                    onClick={handleSnakeClick}
                    className={`w-full flex items-center py-3.5 px-4 rounded-lg transition-all duration-300 text-lg font-medium ${
                      location.pathname === "/snake"
                        ? "bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400"
                        : "text-slate-200 hover:bg-slate-700/50 hover:text-white active:bg-slate-700"
                    } focus-ring`}
                  >
                    {getNavIcon("Snake")}
                    Snake
                  </button>
                </li>
              </nav>

              {/* Divider */}
              <li className={`border-t border-slate-700 my-6 transition-all duration-300 ${open ? "translate-y-0 opacity-100 delay-[550ms]" : "translate-y-[-10px] opacity-0"}`} aria-hidden="true" />

              {/* Social Links Section */}
              <li className={`text-center transition-all duration-300 ${open ? "translate-y-0 opacity-100 delay-[600ms]" : "translate-y-[-10px] opacity-0"}`}>
                <p className="text-slate-400 text-sm mb-3 font-medium">
                  Connect with me
                </p>
                <div className="flex justify-center gap-4">
                  <SocialLinks variant="about" />
                </div>
              </li>

              {/* Tagline */}
              <li className={`text-center text-slate-500 text-xs mt-6 leading-relaxed pb-2 transition-all duration-300 ${open ? "translate-y-0 opacity-100 delay-[650ms]" : "translate-y-[-10px] opacity-0"}`}>
                Building impactful software &<br />mentoring the next generation
              </li>
            </ul>
          </div>
        )}

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex lg:items-center lg:pr-0 pr-4">
          {NAV_LINKS.map((link) => {
            const linkHash = link.link.includes("#")
              ? `#${link.link.split("#")[1]}`
              : "";
            const isActive =
              (linkHash && activeSection === linkHash) ||
              (location.pathname === link.link && link.link.startsWith("/"));
            return (
              <li
                key={link.name}
                className="lg:ml-4 text-xl lg:text-base xl:text-xl"
              >
                <Link
                  to={link.link}
                  scroll={scrollWithOffset}
                  className={`hover:text-white duration-500 border border-transparent hover:border-cyan-500 px-2 py-1 rounded transition-colors focus-ring whitespace-nowrap ${
                    isActive ? "border-b-2 !border-cyan-400 text-cyan-400" : ""
                  }`}
                  onClick={(e) => handleLinkClick(e, link.link, link.name)}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}

          <li className="lg:ml-4 text-xl lg:text-base xl:text-xl">
            <button
              onClick={handleSnakeClick}
              className={`hover:text-white duration-500 cursor-pointer border border-transparent hover:border-cyan-500 px-2 py-1 rounded transition-colors focus-ring ${
                location.pathname === "/snake"
                  ? "border-b-2 !border-cyan-400 text-cyan-400"
                  : ""
              }`}
            >
              Snake
            </button>
          </li>

          <li className="lg:ml-5 text-xl lg:text-base xl:text-xl">
            <Link
              to="/#contact"
              scroll={scrollWithOffset}
              className={`inline-flex items-center text-white font-[Poppins] py-2 px-3 lg:px-4 rounded duration-300 transition-all focus-ring focus:ring-offset-2 focus:ring-offset-slate-800 ${
                activeSection === "#contact"
                  ? "bg-purple-600 shadow-lg shadow-purple-500/40 ring-2 ring-purple-400 scale-105"
                  : "bg-purple-700 hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 shadow-md shadow-purple-500/25"
              }`}
              onClick={(e) => handleLinkClick(e, "/#contact", "Contact")}
              aria-label="Contact Andrew Alagna"
            >
              Contact
              <ArrowRightIcon
                className="w-3 h-3 lg:w-4 lg:h-4 ml-1"
                aria-hidden="true"
              />
            </Link>
          </li>
        </ul>
      </div>

      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-slate-950 text-white px-3 py-1 rounded text-xs">
          {width}px {isMobile ? "(Mobile)" : "(Desktop)"}
        </div>
      )}
    </nav>
  );
};
