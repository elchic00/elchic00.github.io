import { useState, useCallback, useEffect } from "react";
import { ArrowRightIcon, MenuIcon, XIcon } from "@heroicons/react/solid";
import { useNavigate, useLocation } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { useClickOutside, useWindowSize } from "../hooks";
import { NAV_LINKS, scrollWithOffset, TIMING } from "../constants";
import { MonogramOverlap } from "./shared/MonogramLogo";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const { width } = useWindowSize(TIMING.NAVBAR_DEBOUNCE);
  const isMobile = width < 768;

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
      const sections = NAV_LINKS.map((link) => {
        const hash = link.link.split("#")[1];
        return hash ? document.getElementById(hash) : null;
      }).filter(Boolean);

      const scrollPosition = window.scrollY + 100;

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
      <div className="flex justify-between items-center py-3 px-4 md:px-8">
        <Link
          to="/#about"
          scroll={scrollWithOffset}
          className="font-bold text-xl md:text-2xl cursor-pointer inline-flex items-center font-[Poppins] text-slate-200 hover:text-white duration-500 border border-transparent hover:border-cyan-500 px-2 py-1 rounded transition-colors focus-ring whitespace-nowrap"
          onClick={(e) => handleLinkClick(e, "/#about", "Home")}
          aria-label="Andrew Alagna - Home"
        >
          <MonogramOverlap className="w-8 h-8 md:w-10 md:h-10 text-cyan-500 mr-1" />
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

        <ul
          className={`bg-slate-800/95 backdrop-blur-md md:backdrop-blur-none md:bg-transparent md:flex md:items-center md:pb-0 pb-12 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 md:pr-0 pr-4 transition-all duration-500 ease-in ${
            open ? "top-[68px]" : "top-[-490px]"
          }`}
        >
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
                className="md:ml-3 lg:ml-4 text-xl md:text-base lg:text-xl md:my-0 my-7"
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

          <li className="md:ml-3 lg:ml-4 text-xl md:text-base lg:text-xl md:my-0 my-7">
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

          <li className="md:ml-4 lg:ml-5 text-xl md:text-base lg:text-xl md:my-0 my-7">
            <Link
              to="/#contact"
              scroll={scrollWithOffset}
              className="inline-flex items-center bg-purple-700 text-white font-[Poppins] py-2 px-3 md:px-4 rounded hover:bg-purple-600 hover:shadow-lg hover:scale-105 duration-300 transition-all focus-ring focus:ring-offset-2 focus:ring-offset-slate-800"
              onClick={(e) => handleLinkClick(e, "/#contact", "Contact")}
              aria-label="Contact Andrew Alagna"
            >
              Contact
              <ArrowRightIcon
                className="w-3 h-3 md:w-4 md:h-4 ml-1"
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
