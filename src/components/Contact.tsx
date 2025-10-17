import { useRef, useCallback, useEffect, useState, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import { EmojiHappyIcon } from "@heroicons/react/solid";
import { Footer } from "./Footer";
import { Button } from "./shared/Button";
import { useFormValidation, useAsync, useDebounce } from "../hooks";
import { APP_CONFIG } from "../constants";

interface ContactFormValues {
  user_name: string;
  user_email: string;
  message: string;
}

type ValidationRule = (value: string) => string;

interface ValidationRules {
  [key: string]: ValidationRule[];
}

// Validation rules
const validationRules: ValidationRules = {
  user_name: [
    (value: string) => (!value?.trim() ? "Name is required" : ""),
    (value: string) =>
      value?.trim().length < 2 ? "Name must be at least 2 characters" : "",
  ],
  user_email: [
    (value: string) => (!value?.trim() ? "Email is required" : ""),
    (value: string) =>
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? "Please enter a valid email"
        : "",
  ],
  message: [
    (value: string) => (!value?.trim() ? "Message is required" : ""),
    (value: string) =>
      value?.trim().length < 10 ? "Message must be at least 10 characters" : "",
  ],
};

export const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [showMailtoFallback, setShowMailtoFallback] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(APP_CONFIG.EMAIL_PUBLIC_KEY);
  }, []);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  } = useFormValidation(
    {
      user_name: "",
      user_email: "",
      message: "",
    },
    validationRules
  ) as {
    values: ContactFormValues;
    errors: Partial<Record<keyof ContactFormValues, string>>;
    touched: Partial<Record<keyof ContactFormValues, boolean>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    validateAll: () => boolean;
    resetForm: () => void;
  };

  // ✨ Debounce validation feedback for better UX (wait 400ms after typing stops)
  const debouncedName = useDebounce(values.user_name, 400);
  const debouncedEmail = useDebounce(values.user_email, 400);
  const debouncedMessage = useDebounce(values.message, 400);

  // Only show errors after debounce period and if field has been touched
  const showNameError =
    touched.user_name && errors.user_name && values.user_name === debouncedName;
  const showEmailError =
    touched.user_email &&
    errors.user_email &&
    values.user_email === debouncedEmail;
  const showMessageError =
    touched.message && errors.message && values.message === debouncedMessage;

  const sendEmailAsync = useCallback(async () => {
    if (!formRef.current) throw new Error("Form reference not available");

    return await emailjs.sendForm(
      APP_CONFIG.EMAIL_SERVICE_ID,
      APP_CONFIG.EMAIL_TEMPLATE_ID,
      formRef.current,
      APP_CONFIG.EMAIL_PUBLIC_KEY
    );
  }, []);

  const { execute: sendEmail, isLoading } = useAsync(sendEmailAsync);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    if (!validateAll()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fix the errors in the form before submitting.",
      });
      return;
    }

    try {
      await sendEmail();

      Swal.fire({
        icon: "success",
        title: "Message Sent Successfully",
        text: "Thank you for reaching out! I'll get back to you soon.",
      });

      resetForm();
      if (formRef.current) formRef.current.reset();
    } catch (error: unknown) {
      console.error("Email send error:", error);

      let errorMessage =
        "An error occurred while sending your message. Please try again.";

      if (error && typeof error === 'object') {
        if ('text' in error && typeof error.text === 'string') {
          errorMessage = error.text;
        } else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }

      // Show mailto fallback option
      setShowMailtoFallback(true);

      Swal.fire({
        icon: "error",
        title: "Message was not sent!",
        text: errorMessage,
        footer: '<small>A fallback option will appear below if you have a VPN or firewall blocking the form.</small>',
      });
    }
  };

  // Generate mailto link with form data
  const generateMailtoLink = (): string => {
    const subject = encodeURIComponent("Portfolio Contact");
    const body = encodeURIComponent(
      `Name: ${values.user_name}\n\nEmail: ${values.user_email}\n\nMessage:\n${values.message}`
    );
    return `mailto:aalagna04@gmail.com?subject=${subject}&body=${body}`;
  };

  const getInputClassName = (fieldName: keyof ContactFormValues): string => {
    const baseClasses =
      "w-full bg-slate-800 rounded border text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out";

    // ✨ Use debounced error state for smoother UX
    let hasError = false;
    if (fieldName === "user_name") hasError = !!showNameError;
    if (fieldName === "user_email") hasError = !!showEmailError;
    if (fieldName === "message") hasError = !!showMessageError;

    const errorClasses = hasError
      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-900"
      : "border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900";

    return `${baseClasses} ${errorClasses}`;
  };

  return (
    <section id="contact" className="relative">
      <div className="container px-5 py-10 mx-auto flex sm:flex-nowrap flex-wrap">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="lg:w-1/2 flex flex-col mx-auto w-full md:py-3 mt-4 md:mt-0"
        >
          <h2 className="text-white sm:text-4xl text-3xl mb-1 font-medium title-font underline-offset-4 underline flex items-center gap-2">
            Contact Me <EmojiHappyIcon className="w-10 h-10 inline-block" aria-hidden="true" />
          </h2>
          <p className="leading-relaxed mb-5 mt-2">
            Send me a message with the form below
          </p>

          {/* Name Field */}
          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="user_name"
              value={values.user_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName("user_name")}
              aria-required="true"
              aria-invalid={!!showNameError}
              aria-describedby={showNameError ? "name-error" : undefined}
            />
            {/* ✨ Only show error after debounce period */}
            {showNameError && (
              <p
                id="name-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.user_name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="user_email"
              value={values.user_email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName("user_email")}
              aria-required="true"
              aria-invalid={!!showEmailError}
              aria-describedby={showEmailError ? "email-error" : undefined}
            />
            {/* ✨ Only show error after debounce period */}
            {showEmailError && (
              <p
                id="email-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.user_email}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="relative mb-4">
            <label htmlFor="message" className="leading-7 text-sm">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${getInputClassName(
                "message"
              )} h-32 resize-none leading-6`}
              aria-required="true"
              aria-invalid={!!showMessageError}
              aria-describedby={showMessageError ? "message-error" : undefined}
            />
            {/* ✨ Only show error after debounce period */}
            {showMessageError && (
              <p
                id="message-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            loading={isLoading}
            className="w-full"
          >
            Send
          </Button>

          {/* Mailto Fallback - shown when EmailJS fails */}
          {showMailtoFallback && (
            <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-600 rounded">
              <p className="text-sm text-yellow-200 mb-3">
                Having trouble? This might be due to a VPN or firewall. Click below to open your email client instead:
              </p>
              <a
                href={generateMailtoLink()}
                className="block text-center bg-yellow-600 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Open Email Client
              </a>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </section>
  );
};
