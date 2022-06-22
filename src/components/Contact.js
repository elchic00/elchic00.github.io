import React from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import {CircularProgress} from '@mui/material';
import Footer from "./Footer";

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
            {/*<div style={{textAlign: 'center', zIndex: 2}}>*/}
            {/*    <Link to='#about'>*/}
            {/*        <p >Top of Page</p> <ArrowCircleUpIcon sx={{fontSize: 50, color: '#6366f1', "&:hover": {color: '#a5b4fc'}}}/>*/}
            {/*    </Link>*/}
            {/*</div>*/}
            <div className="container px-5 py-10 mx-auto flex sm:flex-nowrap flex-wrap">
                <form
                    onSubmit={sendEmail}
                    name="contact"
                    className="lg:w-1/2 flex flex-col mx-auto w-full md:py-3 mt-4 md:mt-0"
                >
                    <h2 className="text-white sm:text-4xl text-3xl mb-1 font-medium title-font border-b sm:w-1/2 w-3/4 ">
                        Work With Me <ion-icon name="happy"></ion-icon>
                    </h2>
                    <p className="leading-relaxed mb-5 mt-2">
                        Send me a message with the form below
                    </p>
                    <div className="relative mb-4">
                        <label htmlFor="name" className="leading-7 text-sm ">
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
                        <label htmlFor="email" className="leading-7 text-sm ">
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
                            className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                        />
                    </div>
                    {disable !== true ? (
                        <button
                            disabled={disable}
                            type="submit"
                            className="text-white bg-indigo-600 border-0 py-2  focus:outline-none hover:bg-indigo-500 duration-500 rounded text-lg"
                        >
                            Send
                        </button>

                    ) : (
                        <button
                            disabled={disable}
                            type="submit"
                            className="text-white bg-indigo-500 border-0 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                        >
                            <CircularProgress className='h-3' sx={{color:'white'}}/>
                        </button>

                    )}
                </form>
            </div>
         <Footer/>
        </section>
    );
}
