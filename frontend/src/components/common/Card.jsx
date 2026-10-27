import React from 'react';

export const Card = ({
  children,
  variant = 'default', // 'default' | 'elevated' | 'interactive'
  padding = 'md',
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  const paddingMap = {
    none: 0,
    sm: '10px',
    md: '15px',
    lg: '1.25rem',
    xl: '1.75rem',
  };

  const getBackground = () => {
    switch (variant) {
      case 'elevated':
        return 'var(--bg-card-elevated)';
      case 'interactive':
      case 'default':
      default:
        return 'var(--bg-card)';
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: getBackground(),
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: paddingMap[padding] ?? paddingMap.md,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      className={`card ${variant === 'interactive' || onClick ? 'card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Badge = ({
  children,
  variant = 'slate', // 'lime' | 'emerald' | 'slate' | 'amber' | 'rose' | 'sky'
  size = 'md',
  dot = false,
  className = '',
  style = {},
}) => {
  const sizeStyles = {
    sm: { padding: '0.125rem 0.5rem', fontSize: '0.6875rem' },
    md: { padding: '0.25rem 0.625rem', fontSize: '0.75rem' },
    lg: { padding: '0.375rem 0.875rem', fontSize: '0.8125rem' },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={`badge badge-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600,
        letterSpacing: '0.02em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...currentSize,
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          }}
        />
      )}
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    applied: { label: 'Applied', variant: 'slate' },
    reviewed: { label: 'Reviewed', variant: 'sky' },
    shortlisted: { label: 'Shortlisted', variant: 'lime' },
    assessment: { label: 'Assessment', variant: 'amber' },
    interview: { label: 'Interview Scheduled', variant: 'lime' },
    offer: { label: 'Offer Received', variant: 'emerald' },
    rejected: { label: 'Not Selected', variant: 'rose' },
    active: { label: 'Active', variant: 'emerald' },
    paused: { label: 'Paused', variant: 'amber' },
  };

  const config = statusConfig[status?.toLowerCase()] || { label: status || 'Pending', variant: 'slate' };

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
};

export const Avatar = ({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    xxl: 80,
  };

  const px = sizeMap[size] || sizeMap.md;

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'JD';

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: px,
          height: px,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid var(--border-primary)',
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: px,
        height: px,
        borderRadius: '50%',
        backgroundColor: 'var(--bg-card-elevated)',
        border: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: px * 0.38,
        fontWeight: 700,
        color: 'var(--color-primary)',
        userSelect: 'none',
        flexShrink: 0,
      }}
      aria-label={alt || name}
    >
      {initials}
    </div>
  );
};
