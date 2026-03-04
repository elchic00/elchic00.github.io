import { ButtonProps, ButtonVariant, ButtonSize } from '../../types';

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
  const baseClasses = 'inline-flex items-center justify-center text-center rounded-lg focus-ring transition-all duration-300 disabled:cursor-not-allowed font-medium';

  const variantClasses: Record<ButtonVariant, string> = {
    // Primary: High-contrast call to action with a subtle outer glow on hover
    primary: 'text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-95 disabled:opacity-50',
    
    secondary: 'text-white bg-slate-800 hover:bg-slate-700 hover:scale-[1.03] active:scale-95 border border-slate-700',
    
    neutral: 'border border-slate-500/50 text-slate-200 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/80 hover:border-cyan-500/50 hover:text-white transition-all duration-300',

    ghost: 'border border-cyan-400/40 text-cyan-300 bg-cyan-950/20 backdrop-blur-md hover:bg-cyan-500/30 hover:border-cyan-300 hover:text-cyan-100 font-semibold shadow-sm',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
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
