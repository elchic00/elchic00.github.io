/**
 * Contact form component with email sending via EmailJS
 * Refactored to use useContactForm hook for cleaner separation of concerns
 */

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { MailIcon, LightningBoltIcon, TrashIcon } from "@heroicons/react/solid";
import { Button } from "../shared/Button";
import { useAlert } from "../shared/Alert";
import { useContactForm, useScrollReveal } from "../../hooks";
import { APP_CONFIG } from "../../constants";
import { ContactSuccessModal } from "./ContactSuccessModal";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { MonogramOverlap } from "../shared/MonogramLogo";
import messageTemplates from "../../data/structured/messageTemplates.json";

export const Contact: React.FC = () => {
  const location = useLocation();
  const { fire: showAlert, AlertComponent } = useAlert();
  const { ref: contactRef, isVisible: contactVisible } = useScrollReveal();
  // Show immediately when navigated directly to #contact (avoids IntersectionObserver
  // race with ScrollToHash's smooth scroll landing in the -100px rootMargin dead zone)
  const formVisible = location.hash === "#contact" || contactVisible;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showClearDraftDialog, setShowClearDraftDialog] = useState(false);

  useEffect(() => {
    emailjs.init(APP_CONFIG.EMAIL_PUBLIC_KEY);
  }, []);

  useEffect(() => {
    const handlePreFill = (event: CustomEvent<{ message: string }>) => {
      const preFillMessage =
        event.detail.message || sessionStorage.getItem("preFillMessage");
      if (preFillMessage) {
        // Focus the message textarea after a short delay
        setTimeout(() => {
          const messageTextarea = document.getElementById(
            "message",
          ) as HTMLTextAreaElement;
          if (messageTextarea) {
            messageTextarea.value = preFillMessage;
            messageTextarea.focus();
            // Trigger change event to update form state
            const changeEvent = new Event("input", { bubbles: true });
            messageTextarea.dispatchEvent(changeEvent);
          }
        }, 400);
        sessionStorage.removeItem("preFillMessage");
      }
    };

    window.addEventListener("preFillContactForm" as any, handlePreFill);
    return () =>
      window.removeEventListener("preFillContactForm" as any, handlePreFill);
  }, []);

  const contactForm = useContactForm(
    () => {
      setShowSuccessModal(true);
    },
    (error) => {
      const isValidationError = error.message.includes("fix the errors");

      showAlert({
        type: isValidationError ? "warning" : "error",
        title: isValidationError ? "Validation Error" : "Message was not sent!",
        message: error.message,
        footer: isValidationError
          ? undefined
          : "<small>A fallback option will appear below if you have a VPN or firewall blocking the form.</small>",
      });
    },
  );

  const handleTemplateSelect = (template: string) => {
    contactForm.applyTemplate(template);
    setShowTemplates(false);
  };

  return (
    <>
      {AlertComponent}
      <ContactSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
      <section id="contact" className="relative pb-0 bg-slate-950">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/98 to-slate-950 pointer-events-none z-0"></div>

        <div className="container px-5 py-16 mx-auto flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8 lg:gap-12 relative z-10">
          {/* Sidebar: personal sign-off, echoes the Hero's glass-panel + eyebrow-tag language */}
          <div className="w-full max-w-md lg:max-w-sm lg:w-2/5 flex flex-col justify-start">
            <div
              className="rounded-2xl p-6 sm:p-8 ring-1 ring-white/10 shadow-2xl"
              style={{ backgroundColor: "rgba(2, 6, 23, 0.6)" }}
            >
              <MonogramOverlap className="h-9 w-auto text-cyan-400 mb-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300 mb-3">
                Let's talk
              </p>
              <p className="text-2xl font-bold text-white mb-3">
                Andrew Alagna
              </p>
              <p className="text-slate-300 leading-relaxed">
                Reach out about frontend architecture, accessibility, or the AI
                systems I run at home — I read every message.
              </p>
            </div>
          </div>

          <form
            ref={(el) => {
              (
                contactForm.formRef as React.MutableRefObject<HTMLFormElement | null>
              ).current = el;
              if (el) (contactRef as any).current = el;
            }}
            onSubmit={contactForm.handleSubmit}
            className={`lg:w-1/2 flex flex-col w-full md:py-3 mt-4 md:mt-0 bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800 scroll-reveal-scale ${formVisible ? "visible" : ""}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white text-3xl sm:text-5xl font-black tracking-tight flex items-center gap-2">
                Contact Me{" "}
                <MailIcon className="w-10 h-10 inline-block text-gray-300" aria-hidden="true" />
              </h2>
              {contactForm.hasDraft && (
                <button
                  type="button"
                  onClick={() => setShowClearDraftDialog(true)}
                  className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                  aria-label="Clear saved draft"
                >
                  <TrashIcon className="w-4 h-4" aria-hidden="true" />
                  Clear Draft
                </button>
              )}
            </div>

            {contactForm.hasDraft && (
              <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-sm text-cyan-300">
                  💾 Draft restored from your last visit
                </p>
              </div>
            )}

            {/* Message Templates */}
            <div className="mb-5">
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-sm font-medium text-cyan-300 hover:text-cyan-200 flex items-center gap-1 transition-colors"
              >
                <LightningBoltIcon className="w-4 h-4" aria-hidden="true" />
                {showTemplates ? "Hide" : "Use"} Quick Templates
              </button>

              {showTemplates && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {messageTemplates.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleTemplateSelect(tmpl.template)}
                      className="text-left p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                    >
                      <span className="text-lg mb-1 block" aria-hidden="true">{tmpl.icon}</span>
                      <span className="text-sm font-medium text-white">
                        {tmpl.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-slate-200">
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
                aria-describedby={
                  contactForm.showNameError ? "name-error" : undefined
                }
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
              <label htmlFor="email" className="leading-7 text-sm text-slate-200">
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
                aria-describedby={
                  contactForm.showEmailError ? "email-error" : undefined
                }
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
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="message" className="leading-7 text-sm text-slate-200">
                  Message <span className="text-red-500">*</span>
                </label>
                <span
                  className={`text-xs ${contactForm.characterCount > contactForm.maxCharacters * 0.9 ? "text-yellow-400" : "text-slate-400"}`}
                >
                  {contactForm.characterCount}/{contactForm.maxCharacters}
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                value={contactForm.values.message}
                onChange={contactForm.handleChange}
                onBlur={contactForm.handleBlur}
                className={`${contactForm.getInputClassName("message")} h-32 resize-none leading-6`}
                required
                minLength={10}
                maxLength={contactForm.maxCharacters}
                aria-required="true"
                aria-invalid={!!contactForm.showMessageError}
                aria-describedby={
                  contactForm.showMessageError
                    ? "message-error message-counter"
                    : "message-counter"
                }
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
                  Having trouble? This might be due to a VPN or firewall. Click
                  below to open your email client instead:
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
      </section>

      <ConfirmDialog
        isOpen={showClearDraftDialog}
        onClose={() => setShowClearDraftDialog(false)}
        onConfirm={() => {
          contactForm.clearDraft();
          setShowClearDraftDialog(false);
        }}
        title="Clear Draft?"
        message="This will remove all saved information from your draft. This action cannot be undone."
        confirmText="Clear Draft"
        cancelText="Keep Draft"
        variant="danger"
      />
    </>
  );
};
