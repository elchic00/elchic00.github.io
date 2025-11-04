import { ButtonProps, ButtonVariant, ButtonSize } from '../../types';

/**
 * Reusable Button Component
 *
 * Variants:
 * - primary: Cyan background with WCAG AA compliant contrast (default)
 * - secondary: Slate background
 * - success: Teal background
 * - ghost: Transparent with border
 *
 * Sizes:
 * - sm: Small padding
 * - md: Medium padding (default)
 * - lg: Large padding
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ariaLabel,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center text-center border-0 rounded focus-ring transition-colors duration-500 disabled:cursor-not-allowed';

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md hover:shadow-lg hover:shadow-cyan-500/30 disabled:from-cyan-900 disabled:to-blue-900 disabled:text-gray-400 disabled:shadow-none',
    secondary: 'text-white bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500',
    success: 'text-white bg-teal-700 hover:bg-teal-600 disabled:bg-teal-900 disabled:text-gray-400',
    ghost: 'text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-gray-600',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
