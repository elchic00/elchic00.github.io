import PropTypes from 'prop-types';

/**
 * Reusable Button Component
 *
 * Variants:
 * - primary: Indigo background (default)
 * - secondary: Slate background
 * - success: Green background
 * - ghost: Transparent with border
 *
 * Sizes:
 * - sm: Small padding
 * - md: Medium padding (default)
 * - lg: Large padding
 */
export const Button = ({
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
  const baseClasses = 'inline-flex items-center justify-center text-center border-0 rounded focus:outline-none focus:ring-2 focus:ring-lime-500 transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses = {
    primary: 'text-white bg-indigo-600 hover:bg-indigo-500',
    secondary: 'text-white bg-slate-700 hover:bg-slate-600',
    success: 'text-white bg-green-800 hover:bg-green-700',
    ghost: 'text-gray-300 bg-gray-800 hover:bg-gray-700',
  };

  const sizeClasses = {
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

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
};
