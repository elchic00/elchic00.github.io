export interface Project {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  videos?: string[];
  link: string;
}

export interface Photo {
  url: string;
  alt: string;
  caption: string;
}

export interface Trip {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  photos: Photo[];
}

export type ButtonVariant = 'primary' | 'secondary' | 'neutral' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: ButtonType;
  onClick?: () => void;
  ariaLabel?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}
