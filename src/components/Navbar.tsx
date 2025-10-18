import { useState, useCallback, useEffect } from "react";
import { ArrowRightIcon, MenuIcon, XIcon } from "@heroicons/react/solid";
import { useNavigate, useLocation } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { useClickOutside, useWindowSize } from "../hooks";
import { NAV_LINKS, scrollWithOffset } from "../constants";
import { MonogramOverlap } from "./shared/MonogramLogo";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const { width } = useWindowSize(150);
  const isMobile = width < 768;

  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);

  const navRef = useClickOutside(closeMenu);

  useEffect(() => {
    if (!isMobile && open) {
      closeMenu();
    }
  }, [isMobile, open, closeMenu]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, linkPath: string) => {
      // Extract route path and hash from link
      const targetRoute = linkPath.startsWith("/#") ? "/" : linkPath;
      const hasHash = linkPath.includes("#");

      // If already on this route AND there's no hash, scroll to top
      if (location.pathname === targetRoute && !hasHash) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      // If there's a hash, let react-router-hash-link handle it

      closeMenu();
      e?.currentTarget?.blur?.();
    },
    [closeMenu, location.pathname]
  );

  const handleSnakeClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // If already on Snake page, scroll to top instead of navigating
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
      className="bg-slate-800 shadow-md w-full fixed top-0 left-0 z-10"
      aria-label="Main navigation"
    >
      <div className="flex justify-between items-center py-3 px-4 md:px-6">
        <Link
          to="/#about"
          scroll={scrollWithOffset}
          className="font-bold text-2xl cursor-pointer inline-flex items-center font-[Poppins] text-slate-200 hover:text-white duration-500 border border-transparent hover:border-cyan-500 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 whitespace-nowrap"
          onClick={(e) => handleLinkClick(e, "/#about")}
          aria-label="Andrew Alagna - Home"
        >
          <MonogramOverlap className="w-10 h-10 text-cyan-500 mr-1" />
          Andrew Alagna
        </Link>

        {isMobile && (
          <button
            onClick={toggleMenu}
            className="absolute right-4 top-5 cursor-pointer text-slate-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
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
          className={`bg-slate-800 md:flex md:items-center md:pb-0 pb-12 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-[68px]" : "top-[-490px]"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.name} className="md:ml-4 text-xl md:my-0 my-7">
              <Link
                to={link.link}
                scroll={scrollWithOffset}
                className="hover:text-white duration-500 border border-transparent hover:border-cyan-500 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 whitespace-nowrap"
                onClick={(e) => handleLinkClick(e, link.link)}
              >
                {link.name}
              </Link>
            </li>
          ))}

          <li className="md:ml-4 text-xl md:my-0 my-7">
            <button
              onClick={handleSnakeClick}
              className="hover:text-white duration-500 cursor-pointer border border-transparent hover:border-cyan-500 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              Snake
            </button>
          </li>

          <li className="md:ml-4 text-xl md:my-0 my-7 md:mr-0 mr-4">
            <Link
              to="/#contact"
              scroll={scrollWithOffset}
              className="inline-flex items-center bg-purple-700 text-white font-[Poppins] py-2 px-6 rounded hover:bg-purple-600 duration-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
              onClick={(e) => handleLinkClick(e, "/#contact")}
            >
              Contact
              <ArrowRightIcon className="w-4 h-4 ml-1" />
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
