import React from 'react';
import { Icon } from '../icons/Icon';
import { Button } from './Button';

export const EmptyState = ({
  icon = 'search',
  title = 'No items found',
  description = 'Try adjusting your filters or search terms.',
  actionLabel,
  onAction,
  className = '',
  style = {},
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: 'var(--bg-card)',
        border: '1px dashed var(--border-primary)',
        borderRadius: 'var(--radius-xl)',
        ...style,
      }}
      className={`empty-state ${className}`}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-card-elevated)',
          border: '1px solid var(--border-primary)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <Icon name={icon} size={28} />
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: '420px', marginBottom: actionLabel ? '1.25rem' : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an error while loading the data. Please try again.',
  onRetry,
  className = '',
  style = {},
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: 'rgba(239, 68, 68, 0.04)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 'var(--radius-xl)',
        ...style,
      }}
      className={`error-state ${className}`}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: 'var(--color-error-bg)',
          color: 'var(--color-error)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <Icon name="warning" size={26} />
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: '420px', marginBottom: '1.25rem' }}>
        {description}
      </p>
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry} leftIcon={<Icon name="refresh" size={16} />}>
          Retry Action
        </Button>
      )}
    </div>
  );
};

export const SuccessState = ({
  title = 'Success!',
  description = 'Your action was completed successfully.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  style = {},
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-xl)',
        ...style,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent-subtle)',
          border: '2px solid var(--color-accent)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-glow)',
        }}
      >
        <Icon name="check" size={32} strokeWidth={2.5} />
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
        {title}
      </h2>
      <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', maxWidth: '460px', marginBottom: '1.75rem' }}>
        {description}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" size="md" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
        {actionLabel && onAction && (
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export const PageHeader = ({
  title,
  subtitle,
  badge,
  actions,
  className = '',
  style = {},
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
        ...style,
      }}
      className={`page-header ${className}`}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.375rem', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
};

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  style = {},
}) => {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-primary)',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        marginBottom: '1.5rem',
        ...style,
      }}
      className={`tabs-nav ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: -1,
              transition: 'all var(--transition-fast)',
              cursor: 'pointer',
            }}
          >
            {tab.icon && <Icon name={tab.icon} size={16} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  padding: '0.125rem 0.375rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'rgba(163, 230, 53, 0.2)' : 'var(--bg-card-elevated)',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
  style = {},
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '2rem',
        ...style,
      }}
      className={`pagination ${className}`}
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        leftIcon={<Icon name="chevron-left" size={16} />}
      >
        Previous
      </Button>

      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', padding: '0 0.5rem' }}>
        Page <strong style={{ color: 'var(--color-text-primary)' }}>{currentPage}</strong> of {totalPages}
      </span>

      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        rightIcon={<Icon name="chevron-right" size={16} />}
      >
        Next
      </Button>
    </div>
  );
};
