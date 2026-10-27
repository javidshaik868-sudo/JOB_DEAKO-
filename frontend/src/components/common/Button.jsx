import React from 'react';
import { Spinner } from './Spinner';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = false,
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  type = 'button',
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-dark)',
          border: '1px solid var(--color-primary)',
          fontWeight: 600,
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-card-elevated)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--border-primary)',
          fontWeight: 500,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--border-primary)',
          fontWeight: 500,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-secondary)',
          border: '1px solid transparent',
          fontWeight: 500,
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-error-bg)',
          color: 'var(--color-error)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          fontWeight: 600,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.375rem 0.75rem',
          fontSize: '0.8125rem',
          borderRadius: 'var(--radius-sm)',
          gap: '0.375rem',
        };
      case 'lg':
        return {
          padding: '0.875rem 1.5rem',
          fontSize: '1rem',
          borderRadius: 'var(--radius-lg)',
          gap: '0.625rem',
        };
      case 'md':
      default:
        return {
          padding: '0.625rem 1.25rem',
          fontSize: '0.875rem',
          borderRadius: 'var(--radius-md)',
          gap: '0.5rem',
        };
    }
  };

  const baseStyles = {
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--transition-fast)',
    textDecoration: 'none',
    boxShadow: variant === 'primary' && !disabled ? 'var(--shadow-sm)' : 'none',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={baseStyles}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Spinner size={size === 'sm' ? 14 : 18} color={variant === 'primary' ? '#080C0D' : 'currentColor'} />
      ) : (
        leftIcon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>{rightIcon}</span>
      )}
    </button>
  );
};

export const IconButton = ({
  icon,
  ariaLabel,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  const sizeMap = {
    sm: { width: 32, height: 32, borderRadius: 'var(--radius-sm)' },
    md: { width: 40, height: 40, borderRadius: 'var(--radius-md)' },
    lg: { width: 48, height: 48, borderRadius: 'var(--radius-lg)' },
  };

  const dimensions = sizeMap[size] || sizeMap.md;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimensions.width,
        height: dimensions.height,
        borderRadius: dimensions.borderRadius,
        backgroundColor: variant === 'secondary' ? 'var(--bg-card-elevated)' : 'transparent',
        border: variant === 'outline' || variant === 'secondary' ? '1px solid var(--border-primary)' : '1px solid transparent',
        color: 'var(--color-text-secondary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all var(--transition-fast)',
        ...style,
      }}
      className={`icon-btn ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
