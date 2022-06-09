import { ArrowRightIcon } from "@heroicons/react/solid";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom"
import { HashLink as Link } from 'react-router-hash-link';

export default function Navbar() {
  let Links = [
      {name:"Past Work",link:"#projects"},
      {name:"Skills",link:"#skills"},
    // { name: "Play Snake", link: "#snake" },
  ];
  const navigate = useNavigate();
  let [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-800 shadow-md w-full fixed top-0 left-0">
      <div className="justify-between  md:flex items-center py-4 md:px-10 px-7 ">
        <Link
          // onClick={()=>navigate('/')}
          to="#about"
          className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] 
      text-gray-400 hover:text-white"
        >
          <span className=" text-2xl text-indigo-600 mr-1 pt-2">
            <ion-icon name="globe"></ion-icon>{" "}
          </span>
          Andrew Alagna
        </Link>

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
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
              <Link to={link.link} className="text-gray-400 hover:text-white duration-500">
                {link.name}
              </Link>
            </li>
          ))}
          <a     onClick={()=>navigate('/snake')} className="md:ml-8 text-xl md:my-0 my-7 text-gray-400 hover:text-white duration-500 cursor-pointer">
            Play Snake
          </a>
          <Link
            onClick={() => setOpen(!open)}
            to="#contact"
            className="inline-flex items-center top-0 right-0 bg-indigo-600 text-white font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-indigo-400 
    duration-500"
          >
            Contact
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </ul>
      </div>
    </div>
  );
}
