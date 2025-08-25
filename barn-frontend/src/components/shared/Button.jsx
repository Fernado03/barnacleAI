import React from 'react';
import { DESIGN_TOKENS } from '../../constants/designTokens';

/**
 * Standardized Button Component
 * Implements Nielsen's Heuristic 4: Consistency and Standards
 * Provides consistent button styling and behavior across the application
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  ariaLabel,
  type = 'button',
  ...props
}) => {
  // Base button classes
  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-2xl
    ${DESIGN_TOKENS.animations.transition.fast}
    focus:outline-none focus:ring-4 focus:ring-offset-2
    transform transition-all duration-300 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${disabled ? '' : 'hover:shadow-xl active:scale-95'}
  `.trim();

  // Variant styles
  const variantClasses = {
    primary: `
      bg-gradient-to-br ${DESIGN_TOKENS.colors.gradients.primary}
      hover:${DESIGN_TOKENS.colors.gradients.primaryHover}
      text-white shadow-lg
      focus:ring-blue-300
    `.trim(),
    secondary: `
      bg-white border-2 border-blue-600 text-blue-600
      hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700
      focus:ring-blue-300
    `.trim(),
    outline: `
      bg-transparent border-2 border-gray-300 text-gray-700
      hover:bg-gray-50 hover:border-gray-400
      focus:ring-gray-300
    `.trim(),
    danger: `
      bg-gradient-to-br from-red-600 to-red-700
      hover:from-red-700 hover:to-red-800
      text-white shadow-lg
      focus:ring-red-300
    `.trim(),
    ghost: `
      bg-transparent text-gray-600
      hover:bg-gray-100 hover:text-gray-800
      focus:ring-gray-300
    `.trim(),
  };

  // Size styles
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
    xlarge: 'px-10 py-5 text-xl',
  };

  // Icon spacing
  const iconSpacing = {
    left: icon ? 'space-x-2' : '',
    right: icon ? 'space-x-reverse space-x-2' : '',
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${iconSpacing[iconPosition]}
    ${className}
  `.trim();

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

// Specialized button variants for common use cases
export const PrimaryButton = ({ children, ...props }) => (
  <Button variant="primary" {...props}>
    {children}
  </Button>
);

export const SecondaryButton = ({ children, ...props }) => (
  <Button variant="secondary" {...props}>
    {children}
  </Button>
);

export const DangerButton = ({ children, ...props }) => (
  <Button variant="danger" {...props}>
    {children}
  </Button>
);

export const IconButton = ({ icon, ariaLabel, ...props }) => (
  <Button 
    variant="ghost" 
    size="small" 
    className="p-2 rounded-lg"
    ariaLabel={ariaLabel}
    {...props}
  >
    {icon}
  </Button>
);

export default Button;