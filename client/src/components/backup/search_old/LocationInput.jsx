/**
 * Location Input Component
 * Single Responsibility: Handle location input field with icon and clear button
 */

import React from 'react';
import { X } from 'lucide-react';

export const LocationInput = ({
  inputRef,
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onClear,
  placeholder,
  icon,
  isDarkMode,
  className = '',
}) => {
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const clearIconColor = isDarkMode ? 'text-gray-300' : 'text-gray-400';

  return (
    <div className="relative">
      <div className={`glass-input ${className}`}>
        {icon}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          className={textColor}
        />
        {value && (
          <button
            onClick={onClear}
            className="btn-icon"
            aria-label="Clear input"
          >
            <X className={`w-4 h-4 ${clearIconColor}`} />
          </button>
        )}
      </div>
    </div>
  );
};
