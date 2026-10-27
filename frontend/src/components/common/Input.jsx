import React, { useState, forwardRef } from 'react';
import { Icon } from '../icons/Icon';
import { DropdownSelect } from './DropdownSelect';

export const Input = forwardRef(({
  label,
  id,
  type = 'text',
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  containerStyle = {},
  required = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%', ...containerStyle }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftIcon && (
          <span
            style={{
              position: 'absolute',
              left: '0.875rem',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          required={required}
          style={{
            width: '100%',
            paddingLeft: leftIcon ? '2.5rem' : '0.875rem',
            paddingRight: rightIcon ? '2.5rem' : '0.875rem',
            borderColor: error ? 'var(--color-error)' : undefined,
          }}
          className={`form-input ${className}`}
          {...props}
        />

        {rightIcon && (
          <span
            style={{
              position: 'absolute',
              right: '0.875rem',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} style={{ fontSize: '0.75rem', color: 'var(--color-error)', margin: 0 }}>
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const PasswordInput = forwardRef(({ label, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      label={label}
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 0, color: 'inherit' }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
        </button>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

export const SearchInput = forwardRef(({
  placeholder = 'Search...',
  onClear,
  value,
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      type="text"
      placeholder={placeholder}
      value={value}
      leftIcon={<Icon name="search" size={18} />}
      rightIcon={
        value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 0, color: 'inherit' }}
            aria-label="Clear search"
          >
            <Icon name="close" size={16} />
          </button>
        ) : null
      }
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';

export const Textarea = forwardRef(({
  label,
  id,
  error,
  helperText,
  rows = 4,
  required = false,
  className = '',
  containerStyle = {},
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%', ...containerStyle }}>
      {label && (
        <label
          htmlFor={textareaId}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        required={required}
        style={{
          width: '100%',
          resize: 'vertical',
          borderColor: error ? 'var(--color-error)' : undefined,
        }}
        className={`form-textarea ${className}`}
        {...props}
      />

      {error && (
        <p id={`${textareaId}-error`} style={{ fontSize: '0.75rem', color: 'var(--color-error)', margin: 0 }}>
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${textareaId}-helper`} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export const Select = forwardRef(({
  label,
  id,
  options = [],
  error,
  helperText,
  required = false,
  className = '',
  containerStyle = {},
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const { name, value, defaultValue, onChange, onBlur, disabled, style, ...dropdownProps } = props;
  const describedBy = error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%', ...containerStyle }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}

      <DropdownSelect
        {...dropdownProps}
        ref={ref}
        id={selectId}
        name={name}
        ariaLabel={label || 'Select an option'}
        ariaInvalid={Boolean(error)}
        ariaDescribedBy={describedBy}
        options={options}
        value={value}
        defaultValue={defaultValue}
        onChange={(nextValue) => onChange?.({ target: { name, value: nextValue } })}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        triggerClassName={`form-select ${className}`}
        triggerStyle={{
          width: '100%',
          paddingRight: '2.5rem',
          borderColor: error ? 'var(--color-error)' : undefined,
          ...style,
        }}
      />

      {error && (
        <p id={`${selectId}-error`} style={{ fontSize: '0.75rem', color: 'var(--color-error)', margin: 0 }}>
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${selectId}-helper`} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export const Checkbox = forwardRef(({
  label,
  id,
  checked,
  onChange,
  disabled = false,
  error,
  className = '',
  style = {},
  ...props
}, ref) => {
  const checkboxId = id || (label ? `check-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', ...style }}>
      <label
        htmlFor={checkboxId}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.625rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          userSelect: 'none',
          fontSize: '0.875rem',
          color: 'var(--color-text-primary)',
        }}
        className={className}
      >
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{
            width: 18,
            height: 18,
            accentColor: 'var(--color-primary)',
            borderRadius: 'var(--radius-xs)',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && <p style={{ fontSize: '0.75rem', color: 'var(--color-error)', margin: 0 }}>{error}</p>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
