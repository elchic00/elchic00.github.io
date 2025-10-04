import { ArrowRightIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";

export const Navbar = () => {
  let Links = [
    { name: "Past Work", link: "/#projects" },
    { name: "Skills", link: "/#skills" },
  ];
  const navigate = useNavigate();
  let [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-800 shadow-md w-full fixed top-0 left-0 z-10">
      <div className="justify-between  md:flex items-center py-4 md:px-10 px-7 ">
          <Link
            to="/#about"
            className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] text-gray-300 hover:text-white duration-500 border border-transparent hover:border-lime-700 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500"
            onClick={() => setOpen(false)}
          >
            <span className=" text-2xl text-lime-700 mr-1 pt-2">
              <ion-icon name="globe"></ion-icon>{" "}
            </span>
            Andrew Alagna
          </Link>
      
        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden hover:text-white"
        >
          <ion-icon name={open ? "close" : "menu"}></ion-icon>
        </div>

        <ul
          className={`bg-gray-800 md:flex md:items-center md:pb-0 pb-12 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-20 " : "top-[-490px]"
          }`}
        >
          {Links.map((link) => (
            <li
              onClick={() => setOpen(!open)}
              key={link.name}
              className="md:ml-8 text-xl md:my-0 my-7"
            >
              <Link
                to={link.link}
                className="hover:text-white duration-500 border border-transparent hover:border-lime-700 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500"
                onClick={(e) => {
                  // close mobile menu and remove focus ring after click (mouse)
                  setOpen(false);
                  // blur the clicked element so the focus border doesn't 'stick'
                  // using currentTarget keeps it accessible for keyboard users
                  if (e && e.currentTarget && typeof e.currentTarget.blur === 'function') {
                    e.currentTarget.blur();
                  }
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <button
              onClick={(e) => {
                navigate("/snake");
                setOpen(!open);
                // blur the button to remove persistent focus border after click
                if (e && e.currentTarget && typeof e.currentTarget.blur === 'function') {
                  e.currentTarget.blur();
                }
              }}
              className="hover:text-white duration-500 cursor-pointer border border-transparent hover:border-lime-700 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              Play Snake
            </button>
          </li>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link
              onClick={(e) => {
                setOpen(!open);
                if (e && e.currentTarget && typeof e.currentTarget.blur === 'function') {
                  e.currentTarget.blur();
                }
              }}
              to="/#contact"
              className="inline-flex items-center top-0 right-0 bg-lime-700 text-white font-[Poppins] py-2 px-6 rounded md:ml-4 hover:bg-lime-600 duration-500 transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              Contact
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
