import React from 'react';

export const Spinner = ({ size = 20, color = 'var(--color-primary)', className = '', style = {} }) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`spinner ${className}`}
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        position: 'relative',
        width: size,
        height: size,
        color,
        flexShrink: 0,
        ...style,
      }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export const Skeleton = ({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-md)',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Skeleton width="44px" height="44px" borderRadius="var(--radius-md)" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <Skeleton width="60%" height="1.125rem" />
          <Skeleton width="35%" height="0.875rem" />
        </div>
      </div>
      <Skeleton width="100%" height="0.875rem" />
      <Skeleton width="80%" height="0.875rem" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <Skeleton width="30%" height="1.25rem" />
        <Skeleton width="20%" height="1.75rem" borderRadius="var(--radius-sm)" />
      </div>
    </div>
  );
};
