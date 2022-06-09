import React from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import {LinearProgress} from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { HashLink as Link } from 'react-router-hash-link';

export default function Contact() {
    const [disable, setDisable] = React.useState(false);

    function sendEmail(e) {
        setDisable(true);
        e.preventDefault();
        emailjs.sendForm(
            "default_service",
            "template_z9zlm01",
            e.target,
            "user_FhEWKM5IXCkmUoOqe2yTB"
        ).then((result) => {
                Swal.fire({
                    icon: "success",
                    title: "Message Sent Successfully",
                });
                setDisable(false)
            },
            (error) => {
                console.log(error.text);
                Swal.fire({
                    icon: "error",
                    title: "Message was not sent! Check console for error.",
                });
                setDisable(false);
            }
        );
    }

    return (
      <section id="contact" className="relative">
          <Link to='#about'>
          <ArrowCircleUpIcon
              sx={{ml: 'auto', mr:'auto', display:'block', fontSize: 50, color:'#6366f1', "&:hover":{color:'#a5b4fc'}}}

          />
          </Link>

        <div className="container px-5 py-10 mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="lg:w-2/3 md:w-1/2 bg-gray-900 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
            <iframe
              width="100%"
              height="100%"
              title="map"
              className="absolute inset-0"
              frameBorder={0}
              marginHeight={0}
              marginWidth={0}
              style={{ filter: "opacity(0.7)" }}
              src="https://www.google.com/maps/embed/v1/place?q=nassau+county&key=***REDACTED-GOOGLE-API-KEY***"
            />
            />
            <div className="bg-gray-900 relative flex flex-wrap py-6 rounded shadow-md">

              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-semibold text-white tracking-widest text-xs">
                  EMAIL
                </h2>
                <a className="text-indigo-400 leading-relaxed">aalagna04@gmail.com</a>
                <h2 className="title-font font-semibold text-white tracking-widest text-xs mt-4">
                  PHONE
                </h2>
                <p className="leading-relaxed w-max">917-601-9404</p>
              </div>
            </div>
          </div>
          <form
            onSubmit={sendEmail}
            name="contact"
            className="lg:w-1/3 md:w-1/2 flex flex-col md:ml-auto w-full md:py-3 mt-8 md:mt-0 mr-auto"
          >
            <h2 className="text-white sm:text-4xl text-3xl text-center mb-1 font-medium title-font">
              Work With Me <ion-icon name="happy"></ion-icon>
            </h2>
            <p className="leading-relaxed mb-5 text-center">
              Looking for a motivated engineer?
              <br />
              Want to discuss your next project?
              <br />
              Contact me with the form below.
            </p>
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-400">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="user_name"
                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-400">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="user_email"
                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="message" className="leading-7 text-sm text-gray-400">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
              />
            </div>
            {disable != true ? (
              <button
                disabled={disable}
                type="submit"
                className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              >
                Submit
              </button>
            ) : (
              <LinearProgress />
            )}
          </form>
        </div>
      </section>
    );
}
