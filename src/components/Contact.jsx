import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
import { Footer } from "./Footer";

export const Contact = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const sendEmail = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
        await emailjs.sendForm(
        "default_service",
        "template_z9zlm01",
        formRef.current,
        // Ensure this user ID is your actual Public Key from EmailJS
        "user_FhEWKM5IXCkmUoOqe2yTB" 
        );

        Swal.fire({
        icon: "success",
        title: "Message Sent Successfully",
        });

        formRef.current.reset();
    } catch (error) {
        let errorMessage = "An unknown error occurred.";
        // 1. Try to get the specific text from EmailJS response
        if (error && error.text) {
            errorMessage = error.text;
        } 
        // 2. Safely stringify the error object for debugging if 'text' isn't available
        else if (error) {
            // Check for common object properties and combine them, or stringify safely
            errorMessage = error.message || (typeof error === 'object' ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : String(error));
        }
        Swal.fire({
            icon: "error",
            title: "Message was not sent!",
            text: errorMessage,
        });
    } finally {
        setLoading(false);
    }
};


  return (
    <section id="contact" className="relative">
      <div className="container px-5 py-10 mx-auto flex sm:flex-nowrap flex-wrap">
        <form
          ref={formRef}
          onSubmit={sendEmail}
          name="contact"
          noValidate
          className="lg:w-1/2 flex flex-col mx-auto w-full md:py-3 mt-4 md:mt-0"
        >
          <h2 className="text-white sm:text-4xl text-3xl mb-1 font-medium title-font underline-offset-4 underline">
            Work With Me <ion-icon name="happy"></ion-icon>
          </h2>
          <p className="leading-relaxed mb-5 mt-2">
            Send me a message with the form below
          </p>

          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="user_name"
              required
              className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="user_email"
              required
              className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="message" className="leading-7 text-sm">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`text-white border-0 py-2 rounded text-lg w-full ${
              loading
                ? "bg-indigo-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {loading ? (
              <CircularProgress className="h-4" sx={{ color: "white" }} />
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
      <Footer />
    </section>
  );
};