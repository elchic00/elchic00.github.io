/**
 * Application Configuration
 * Contains email service config, contact info, and app-wide settings
 */

// Validate environment variables
const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value) {
    console.warn(`Warning: Environment variable ${name} is not set. Email functionality may not work.`);
    return "";
  }
  return value;
};

export const APP_CONFIG = {
  EMAIL_SERVICE_ID: validateEnvVar("VITE_EMAIL_SERVICE_ID", import.meta.env.VITE_EMAIL_SERVICE_ID),
  EMAIL_TEMPLATE_ID: validateEnvVar("VITE_EMAIL_TEMPLATE_ID", import.meta.env.VITE_EMAIL_TEMPLATE_ID),
  EMAIL_PUBLIC_KEY: validateEnvVar("VITE_EMAIL_PUBLIC_KEY", import.meta.env.VITE_EMAIL_PUBLIC_KEY),
  CONTACT_EMAIL: "aalagna04@gmail.com",
  RESUME_FILENAME: "andrew-alagna-resume.pdf",
} as const;
