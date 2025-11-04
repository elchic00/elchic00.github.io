/**
 * Contact form component with email sending via EmailJS
 * Refactored to use useContactForm hook for cleaner separation of concerns
 */

import { useEffect } from "react";
import emailjs from "@emailjs/browser";
import { EmojiHappyIcon } from "@heroicons/react/solid";
import { Footer } from "./Footer";
import { Button } from "./shared/Button";
import { useAlert } from "./shared/Alert";
import { useContactForm, useScrollReveal } from "../hooks";
import { APP_CONFIG } from "../constants";

export const Contact: React.FC = () => {
  const { fire: showAlert, AlertComponent } = useAlert();
  const { ref: contactRef, isVisible: contactVisible } = useScrollReveal();

  useEffect(() => {
    emailjs.init(APP_CONFIG.EMAIL_PUBLIC_KEY);
  }, []);

  useEffect(() => {
    const handlePreFill = (event: CustomEvent<{ message: string }>) => {
      const preFillMessage = event.detail.message || sessionStorage.getItem("preFillMessage");
      if (preFillMessage) {
        // Focus the message textarea after a short delay
        setTimeout(() => {
          const messageTextarea = document.getElementById("message") as HTMLTextAreaElement;
          if (messageTextarea) {
            messageTextarea.value = preFillMessage;
            messageTextarea.focus();
            // Trigger change event to update form state
            const changeEvent = new Event('input', { bubbles: true });
            messageTextarea.dispatchEvent(changeEvent);
          }
        }, 400);
        sessionStorage.removeItem("preFillMessage");
      }
    };

    window.addEventListener("preFillContactForm" as any, handlePreFill);
    return () => window.removeEventListener("preFillContactForm" as any, handlePreFill);
  }, []);

  const contactForm = useContactForm(
    () => {
      showAlert({
        type: "success",
        title: "Message Sent Successfully",
        message: "Thank you for reaching out! I'll get back to you soon.",
      });
    },
    (error) => {
      const isValidationError = error.message.includes("fix the errors");

      showAlert({
        type: isValidationError ? "warning" : "error",
        title: isValidationError ? "Validation Error" : "Message was not sent!",
        message: error.message,
        footer: isValidationError
          ? undefined
          : '<small>A fallback option will appear below if you have a VPN or firewall blocking the form.</small>',
      });
    }
  );

  return (
    <>
      {AlertComponent}
      <section id="contact" className="relative pb-0 bg-slate-950">
      <div
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-900 to-slate-950 z-0"
        aria-hidden="true"
      />

      <div className="container px-5 py-16 mx-auto flex sm:flex-nowrap flex-wrap relative z-10">
        <form
          ref={(el) => {
            (contactForm.formRef as React.MutableRefObject<HTMLFormElement | null>).current = el;
            if (el) (contactRef as any).current = el;
          }}
          onSubmit={contactForm.handleSubmit}
          className={`lg:w-1/2 flex flex-col mx-auto w-full md:py-3 mt-4 md:mt-0 bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800 scroll-reveal-scale ${contactVisible ? 'visible' : ''}`}
        >
          <h2 className="text-white sm:text-4xl text-3xl mb-1 font-medium title-font underline-offset-4 underline flex items-center gap-2">
            Contact Me <EmojiHappyIcon className="w-10 h-10 inline-block" aria-hidden="true" />
          </h2>
          <p className="leading-relaxed mb-5 mt-2">
            Send me a message with the form below
          </p>

          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="user_name"
              value={contactForm.values.user_name}
              onChange={contactForm.handleChange}
              onBlur={contactForm.handleBlur}
              className={contactForm.getInputClassName("user_name")}
              required
              minLength={2}
              aria-required="true"
              aria-invalid={!!contactForm.showNameError}
              aria-describedby={contactForm.showNameError ? "name-error" : undefined}
            />
            {contactForm.showNameError && (
              <p
                id="name-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {contactForm.errors.user_name}
              </p>
            )}
          </div>

          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="user_email"
              value={contactForm.values.user_email}
              onChange={contactForm.handleChange}
              onBlur={contactForm.handleBlur}
              className={contactForm.getInputClassName("user_email")}
              required
              pattern={contactForm.EMAIL_PATTERN.source.slice(1, -1)}
              title="Please enter a valid email address (e.g., user@example.com)"
              aria-required="true"
              aria-invalid={!!contactForm.showEmailError}
              aria-describedby={contactForm.showEmailError ? "email-error" : undefined}
            />
            {contactForm.showEmailError && (
              <p
                id="email-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {contactForm.errors.user_email}
              </p>
            )}
          </div>

          <div className="relative mb-4">
            <label htmlFor="message" className="leading-7 text-sm">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={contactForm.values.message}
              onChange={contactForm.handleChange}
              onBlur={contactForm.handleBlur}
              className={`${contactForm.getInputClassName("message")} h-32 resize-none leading-6`}
              required
              minLength={10}
              aria-required="true"
              aria-invalid={!!contactForm.showMessageError}
              aria-describedby={contactForm.showMessageError ? "message-error" : undefined}
            />
            {contactForm.showMessageError && (
              <p
                id="message-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {contactForm.errors.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={contactForm.isLoading}
            loading={contactForm.isLoading}
            className="w-full"
          >
            Send
          </Button>

          {contactForm.showMailtoFallback && (
            <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-600 rounded">
              <p className="text-sm text-yellow-200 mb-3">
                Having trouble? This might be due to a VPN or firewall. Click below to open your email client instead:
              </p>
              <a
                href={contactForm.generateMailtoLink()}
                className="block text-center bg-yellow-600 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Open Email Client
              </a>
            </div>
          )}
        </form>
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </section>
    </>
  );
};
