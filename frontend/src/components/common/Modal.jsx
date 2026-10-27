import React, { useEffect } from 'react';
import { Icon } from '../icons/Icon';
import { IconButton } from './Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '550px',
  footer = null,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 200ms ease-out',
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'modalSlideUp 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <style>{`
          @keyframes modalSlideUp {
            from { opacity: 0; transform: scale(0.96) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>

        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 id="modal-title" style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
            {title}
          </h3>
          <IconButton
            icon={<Icon name="close" size={18} />}
            ariaLabel="Close modal"
            onClick={onClose}
            size="sm"
          />
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  side = 'left', // 'left' | 'right'
  width = '300px',
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: width,
          height: '100%',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: side === 'left' ? '1px solid var(--border-primary)' : 'none',
          borderLeft: side === 'right' ? '1px solid var(--border-primary)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          animation: side === 'left' ? 'drawerLeft 250ms ease-out' : 'drawerRight 250ms ease-out',
        }}
      >
        <style>{`
          @keyframes drawerLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          @keyframes drawerRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>
        {title && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>{title}</h3>
            <IconButton
              icon={<Icon name="close" size={18} />}
              ariaLabel="Close drawer"
              onClick={onClose}
              size="sm"
            />
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>{children}</div>
      </div>
    </div>
  );
};
