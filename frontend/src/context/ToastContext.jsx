import React, { createContext, useContext, useState, useCallback } from 'react';
import { Icon } from '../components/icons/Icon';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 3500 }) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast({ message: msg, type: 'success', duration }),
    error: (msg, duration) => addToast({ message: msg, type: 'error', duration }),
    info: (msg, duration) => addToast({ message: msg, type: 'info', duration }),
    warning: (msg, duration) => addToast({ message: msg, type: 'warning', duration }),
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          border: '1px solid rgba(34, 197, 94, 0.4)',
          icon: 'check-circle',
          iconColor: 'var(--color-accent)',
        };
      case 'error':
        return {
          border: '1px solid rgba(239, 68, 68, 0.4)',
          icon: 'x-circle',
          iconColor: 'var(--color-error)',
        };
      case 'warning':
        return {
          border: '1px solid rgba(245, 158, 11, 0.4)',
          icon: 'warning',
          iconColor: 'var(--color-warning)',
        };
      case 'info':
      default:
        return {
          border: '1px solid rgba(56, 189, 248, 0.4)',
          icon: 'info',
          iconColor: 'var(--color-info)',
        };
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 110,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
          maxWidth: '380px',
          width: 'calc(100% - 3rem)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => {
          const style = getTypeStyles(t.type);
          return (
            <div
              key={t.id}
              role="alert"
              style={{
                pointerEvents: 'auto',
                backgroundColor: 'var(--bg-card-elevated)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.875rem 1rem',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'var(--color-text-primary)',
                fontSize: '0.875rem',
                animation: 'toastIn 250ms ease-out',
                border: style.border,
              }}
            >
              <style>{`
                @keyframes toastIn {
                  from { opacity: 0; transform: translateY(12px) scale(0.96); }
                  to { opacity: 1; transform: translateY(0) scale(1); }
                }
              `}</style>
              <span style={{ color: style.iconColor, display: 'flex', flexShrink: 0 }}>
                <Icon name={style.icon} size={18} />
              </span>
              <span style={{ flex: 1 }}>{t.message}</span>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                }}
                aria-label="Dismiss toast"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
