import { useState, useCallback, useEffect } from "react";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { useClickOutside, useWindowSize } from "../hooks";
import { NAV_LINKS } from "../constants";

export const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // ✨ Track window size for responsive behavior
  const { width } = useWindowSize(150); // Debounced by 150ms
  const isMobile = width < 768; // Match Tailwind's 'md' breakpoint

  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);

  const navRef = useClickOutside(closeMenu);

  // ✨ Auto-close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile && open) {
      closeMenu();
    }
  }, [isMobile, open, closeMenu]);

  const handleLinkClick = useCallback(
    (e) => {
      closeMenu();
      // Remove focus from the link after clicking
      e?.currentTarget?.blur?.();
    },
    [closeMenu]
  );

  const handleSnakeClick = useCallback(
    (e) => {
      navigate("/snake");
      closeMenu();
      e?.currentTarget?.blur?.();
    },
    [navigate, closeMenu]
  );

  return (
    <nav
      ref={navRef}
      className="bg-gray-800 shadow-md w-full fixed top-0 left-0 z-10"
      aria-label="Main navigation"
    >
      <div className="justify-between md:flex items-center py-4 md:px-4 px-7">
        {/* Logo */}
        <Link
          to="/#about"
          className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] text-gray-300 hover:text-white duration-500 border border-transparent hover:border-lime-700 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500 whitespace-nowrap"
          onClick={handleLinkClick}
          aria-label="Andrew Alagna - Home"
        >
          <span className="text-2xl text-lime-700 mr-1 pt-2" aria-hidden="true">
            <ion-icon name="globe"></ion-icon>
          </span>
          Andrew Alagna
        </Link>

        {/* Mobile menu button - ✨ Only show on mobile */}
        {isMobile && (
          <button
            onClick={toggleMenu}
            className="text-3xl absolute right-8 top-6 cursor-pointer hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 rounded"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <ion-icon name={open ? "close" : "menu"}></ion-icon>
          </button>
        )}

        {/* Navigation Links */}
        <ul
          className={`bg-gray-800 md:flex md:items-center md:pb-0 pb-12 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-20" : "top-[-490px]"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.name} className="md:ml-4 text-xl md:my-0 my-7">
              <Link
                to={link.link}
                className="hover:text-white duration-500 border border-transparent hover:border-lime-700 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500 whitespace-nowrap"
                onClick={handleLinkClick}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {/* Snake Game Link */}
          <li className="md:ml-4 text-xl md:my-0 my-7">
            <button
              onClick={handleSnakeClick}
              className="hover:text-white duration-500 cursor-pointer border border-transparent hover:border-lime-700 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              Snake
            </button>
          </li>

          {/* Contact CTA */}
          <li className="md:ml-4 text-xl md:my-0 my-7">
            <Link
              to="/#contact"
              className="inline-flex items-center bg-lime-700 text-white font-[Poppins] py-2 px-6 rounded hover:bg-lime-600 duration-500 transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500"
              onClick={handleLinkClick}
            >
              Contact
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </li>
        </ul>
      </div>

      {/* ✨ Optional: Show screen width indicator in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-1 rounded text-xs">
          {width}px {isMobile ? "(Mobile)" : "(Desktop)"}
        </div>
      )}
    </nav>
  );
};
