import React, { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../icons/Icon';

export const DropdownSelect = forwardRef(({
  ariaLabel,
  options = [],
  value,
  defaultValue,
  onChange,
  onBlur,
  onTriggerMouseDown,
  align = 'start',
  className = '',
  triggerClassName = '',
  style = {},
  triggerStyle = {},
  id: controlId,
  name,
  disabled = false,
  required = false,
  ariaInvalid = false,
  ariaDescribedBy,
}, forwardedRef) => {
  const generatedId = useId();
  const id = controlId || generatedId;
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const optionRefs = useRef([]);
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? options[0]?.value ?? '');
  const currentValue = isControlled ? value : uncontrolledValue;
  const selectedIndex = options.findIndex((option) => option.value === currentValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(0, selectedIndex));
  const [menuPosition, setMenuPosition] = useState(null);
  const selectedOption = options[selectedIndex] || options[0];
  const enabledIndices = options.reduce((indices, option, index) => {
    if (!option.disabled) indices.push(index);
    return indices;
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleOutsidePointerDown = (event) => {
      if (rootRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return;
      setIsOpen(false);
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuPosition(null);
      return undefined;
    }

    const updateMenuPosition = () => {
      const trigger = triggerRef.current;
      const menu = menuRef.current;
      if (!trigger || !menu) return;

      const triggerRect = trigger.getBoundingClientRect();
      const viewportPadding = 8;
      const availableWidth = Math.max(0, window.innerWidth - viewportPadding * 2);
      const menuWidth = Math.min(Math.max(menu.scrollWidth, triggerRect.width), availableWidth);
      const availableBelow = window.innerHeight - triggerRect.bottom - 14;
      const availableAbove = triggerRect.top - 14;
      const opensAbove = menu.scrollHeight > availableBelow && availableAbove > availableBelow;
      const availableHeight = opensAbove ? availableAbove : availableBelow;
      const maxHeight = Math.max(60, Math.min(288, window.innerHeight * 0.4, availableHeight));
      const renderedHeight = Math.min(menu.scrollHeight, maxHeight);
      const preferredLeft = align === 'end' ? triggerRect.right - menuWidth : triggerRect.left;
      const left = Math.max(viewportPadding, Math.min(preferredLeft, window.innerWidth - menuWidth - viewportPadding));
      const top = opensAbove
        ? Math.max(viewportPadding, triggerRect.top - renderedHeight - 6)
        : Math.min(triggerRect.bottom + 6, window.innerHeight - renderedHeight - viewportPadding);

      setMenuPosition((current) => {
        if (
          current?.left === left &&
          current?.top === top &&
          current?.minWidth === Math.min(triggerRect.width, menuWidth) &&
          current?.maxHeight === maxHeight &&
          current?.opensAbove === opensAbove
        ) return current;

        return {
          left,
          top,
          minWidth: Math.min(triggerRect.width, menuWidth),
          maxHeight,
          opensAbove,
        };
      });
    };

    updateMenuPosition();
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);
    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [align, isOpen, options.length]);

  useEffect(() => {
    if (isOpen) optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  const openMenu = () => {
    const initialIndex = selectedIndex >= 0 && !options[selectedIndex]?.disabled
      ? selectedIndex
      : enabledIndices[0] ?? 0;
    setActiveIndex(initialIndex);
    setIsOpen(true);
  };

  const selectOption = (option) => {
    if (option.disabled || disabled) return;
    if (!isControlled) setUncontrolledValue(option.value);
    onChange?.(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const moveActiveOption = (direction) => {
    if (enabledIndices.length === 0) return;
    const currentPosition = enabledIndices.indexOf(activeIndex);
    const basePosition = currentPosition < 0
      ? (direction > 0 ? -1 : 0)
      : currentPosition;
    const nextPosition = (basePosition + direction + enabledIndices.length) % enabledIndices.length;
    setActiveIndex(enabledIndices[nextPosition]);
    setIsOpen(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveActiveOption(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (enabledIndices.length > 0) {
        setActiveIndex(event.key === 'Home' ? enabledIndices[0] : enabledIndices.at(-1));
        setIsOpen(true);
      }
      return;
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
      event.preventDefault();
      if (options[activeIndex]) selectOption(options[activeIndex]);
      return;
    }

    if (event.key === 'Tab') setIsOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`portal-select ${className}`}
      style={style}
      onKeyDown={handleKeyDown}
    >
      {name && <input type="hidden" name={name} value={currentValue ?? ''} disabled={disabled} />}
      <button
        ref={(element) => {
          triggerRef.current = element;
          if (typeof forwardedRef === 'function') forwardedRef(element);
          else if (forwardedRef) forwardedRef.current = element;
        }}
        id={controlId}
        type="button"
        className={`portal-select-trigger ${triggerClassName}`}
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required || undefined}
        aria-invalid={ariaInvalid || undefined}
        aria-describedby={ariaDescribedBy}
        aria-controls={isOpen ? `${id}-listbox` : undefined}
        aria-activedescendant={isOpen ? `${id}-option-${activeIndex}` : undefined}
        disabled={disabled}
        style={triggerStyle}
        onMouseDown={onTriggerMouseDown}
        onBlur={(event) => {
          onBlur?.(event);
          if (!rootRef.current?.contains(event.relatedTarget)) setIsOpen(false);
        }}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
      >
        <span className="portal-select-value">{selectedOption?.label}</span>
        <Icon className="portal-select-chevron" name="chevron-down" size={14} aria-hidden="true" />
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          id={`${id}-listbox`}
          className={`portal-select-menu ${menuPosition?.opensAbove ? 'is-above' : ''} ${align === 'end' ? 'is-end' : ''}`}
          style={{
            left: menuPosition?.left ?? 0,
            top: menuPosition?.top ?? 0,
            minWidth: menuPosition?.minWidth ?? triggerRef.current?.getBoundingClientRect().width,
            maxHeight: menuPosition?.maxHeight,
            visibility: menuPosition ? 'visible' : 'hidden',
          }}
          role="listbox"
          aria-label={`${ariaLabel} options`}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              ref={(element) => { optionRefs.current[index] = element; }}
              id={`${id}-option-${index}`}
              className={`portal-select-option ${activeIndex === index ? 'is-active' : ''} ${currentValue === option.value ? 'is-selected' : ''}`}
              role="option"
              aria-selected={currentValue === option.value}
              aria-disabled={option.disabled || undefined}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption(option)}
            >
              <span>{option.label}</span>
              {currentValue === option.value && <Icon name="check" size={14} aria-hidden="true" />}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
});

DropdownSelect.displayName = 'DropdownSelect';