/**
 * Custom hook for managing contact form state, validation, and email sending
 */

import { useRef, useCallback, useState } from "react";
import emailjs from "@emailjs/browser";
import { useFormValidation, useAsync, useDebounce } from "./index";
import { APP_CONFIG } from "../constants";

export interface ContactFormValues {
  user_name: string;
  user_email: string;
  message: string;
}

type ValidationRule = (value: string) => string;

interface ValidationRules {
  [key: string]: ValidationRule[];
}

// Email validation pattern - requires valid TLD with at least 2 letters
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const validationRules: ValidationRules = {
  user_name: [
    (value: string) => (!value?.trim() ? "Name is required" : ""),
    (value: string) =>
      value?.trim().length < 2 ? "Name must be at least 2 characters" : "",
  ],
  user_email: [
    (value: string) => (!value?.trim() ? "Email is required" : ""),
    (value: string) =>
      !EMAIL_PATTERN.test(value) ? "Please enter a valid email" : "",
  ],
  message: [
    (value: string) => (!value?.trim() ? "Message is required" : ""),
    (value: string) =>
      value?.trim().length < 10 ? "Message must be at least 10 characters" : "",
  ],
};

interface UseContactFormReturn {
  formRef: React.RefObject<HTMLFormElement | null>;
  values: ContactFormValues;
  errors: Partial<Record<keyof ContactFormValues, string>>;
  touched: Partial<Record<keyof ContactFormValues, boolean>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
  isLoading: boolean;
  showMailtoFallback: boolean;
  showNameError: boolean;
  showEmailError: boolean;
  showMessageError: boolean;
  getInputClassName: (fieldName: keyof ContactFormValues) => string;
  generateMailtoLink: () => string;
  EMAIL_PATTERN: RegExp;
}

/**
 * Manages contact form state, validation, and submission with EmailJS integration
 *
 * @param onSuccess - Callback fired when email is sent successfully
 * @param onError - Callback fired when email sending fails
 * @returns Form state, handlers, and utility functions
 *
 * @example
 * const contactForm = useContactForm(
 *   () => showAlert({ type: 'success', message: 'Message sent!' }),
 *   (error) => showAlert({ type: 'error', message: error.message })
 * );
 *
 * return (
 *   <form ref={contactForm.formRef} onSubmit={contactForm.handleSubmit}>
 *     <input name="user_name" value={contactForm.values.user_name} onChange={contactForm.handleChange} />
 *   </form>
 * );
 */
export const useContactForm = (
  onSuccess: () => void,
  onError: (error: Error) => void
): UseContactFormReturn => {
  const formRef = useRef<HTMLFormElement>(null);
  const [showMailtoFallback, setShowMailtoFallback] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  } = useFormValidation<ContactFormValues>(
    {
      user_name: "",
      user_email: "",
      message: "",
    },
    validationRules
  );

  const debouncedName = useDebounce(values.user_name, 400);
  const debouncedEmail = useDebounce(values.user_email, 400);
  const debouncedMessage = useDebounce(values.message, 400);

  const showNameError =
    !!(touched.user_name && errors.user_name && values.user_name === debouncedName);
  const showEmailError =
    !!(touched.user_email && errors.user_email && values.user_email === debouncedEmail);
  const showMessageError =
    !!(touched.message && errors.message && values.message === debouncedMessage);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateAll()) {
      onError(new Error("Please fix the errors in the form before submitting."));
      return;
    }

    try {
      await sendEmail();
      onSuccess();
      resetForm();
      if (formRef.current) formRef.current.reset();
    } catch (error: unknown) {
      console.error("Email send error:", error);

      let errorMessage = "An error occurred while sending your message. Please try again.";

      if (error && typeof error === "object") {
        if ("text" in error && typeof error.text === "string") {
          errorMessage = error.text;
        } else if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        }
      }

      setShowMailtoFallback(true);
      onError(new Error(errorMessage));
    }
  };

  const generateMailtoLink = (): string => {
    const subject = encodeURIComponent("Portfolio Contact");
    const body = encodeURIComponent(
      `Name: ${values.user_name}\n\nEmail: ${values.user_email}\n\nMessage:\n${values.message}`
    );
    return `mailto:${APP_CONFIG.CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const getInputClassName = (fieldName: keyof ContactFormValues): string => {
    const baseClasses =
      "w-full bg-slate-800 rounded border text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out";

    let hasError = false;
    if (fieldName === "user_name") hasError = !!showNameError;
    if (fieldName === "user_email") hasError = !!showEmailError;
    if (fieldName === "message") hasError = !!showMessageError;

    const errorClasses = hasError
      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-900"
      : "border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-lg focus:shadow-cyan-500/10";

    return `${baseClasses} ${errorClasses}`;
  };

  return {
    formRef,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isLoading,
    showMailtoFallback,
    showNameError,
    showEmailError,
    showMessageError,
    getInputClassName,
    generateMailtoLink,
    EMAIL_PATTERN,
  };
};
