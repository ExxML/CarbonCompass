/**
 * Shared UI Components
 * Single Responsibility: Provide reusable, presentational UI components
 */

import React from 'react';
import { X } from 'lucide-react';

/**
 * Minimized Panel Button
 * A collapsed panel that can be clicked to expand
 */
export const MinimizedPanel = ({ icon: Icon, label, onClick, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-700';

  return (
    <div
      className="minimized-panel p-3"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="pointer-events-none flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5" />}
        {label && <span className={`text-sm font-medium ${textColor}`}>{label}</span>}
      </div>
    </div>
  );
};

/**
 * Panel Header Component
 * Standard header with title and optional close/minimize button
 */
export const PanelHeader = ({ icon: Icon, title, onClose, onMinimize, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const iconColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className="panel-header">
      <div className="panel-title">
        {Icon && <Icon className="h-5 w-5" />}
        <span className={textColor}>{title}</span>
      </div>
      {(onClose || onMinimize) && (
        <button
          onClick={onClose || onMinimize}
          className={`btn-icon ${iconColor} hover:bg-white/10`}
          aria-label={onClose ? 'Close' : 'Minimize'}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

/**
 * Icon Button Component
 */
export const IconButton = ({ children, onClick, isDarkMode, ariaLabel, className = '' }) => {
  const iconColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <button
      onClick={onClick}
      className={`btn-icon ${iconColor} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

/**
 * Metric Display Component
 * Shows a metric with label and value
 */
export const MetricDisplay = ({ icon: Icon, label, value, color, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const mutedColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5" style={{ color }} />}
        <span className={`text-sm ${mutedColor}`}>{label}</span>
      </div>
      <span className={`font-semibold ${textColor}`}>{value}</span>
    </div>
  );
};

/**
 * Section Header Component
 */
export const SectionHeader = ({ icon: Icon, title, color, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className="suggestions-header">
      {Icon && <Icon className="h-3.5 w-3.5" style={{ color }} />}
      <span className={`text-panel-subtitle ${textColor}`}>{title}</span>
    </div>
  );
};

/**
 * Error Box Component
 */
export const ErrorBox = ({ message }) => {
  return (
    <div className="error-box">
      <p className="m-0 text-sm text-red-600">{message}</p>
    </div>
  );
};

/**
 * Success Box Component
 */
export const SuccessBox = ({ title, children }) => {
  return (
    <div className="success-box">
      {title && <p className="m-0 mb-3 text-base font-semibold text-emerald-600">{title}</p>}
      {children}
    </div>
  );
};

/**
 * Badge Component
 */
export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-500/20 text-gray-700',
    success: 'bg-emerald-500/20 text-emerald-700',
    warning: 'bg-amber-500/20 text-amber-700',
    danger: 'bg-red-500/20 text-red-700',
    info: 'bg-blue-500/20 text-blue-700',
  };

  return <span className={`badge ${variants[variant]} ${className}`}>{children}</span>;
};

/**
 * Divider Component
 */
export const Divider = ({ className = '' }) => {
  return <div className={`section-divider ${className}`} />;
};
