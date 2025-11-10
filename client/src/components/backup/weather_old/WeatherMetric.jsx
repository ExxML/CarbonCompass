/**
 * Weather Metric Component
 * Single Responsibility: Display individual weather metric
 */

import React from 'react';

export const WeatherMetric = ({ icon, label, value, color, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const mutedColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const IconComponent = icon;

  return (
    <div className="metric-card">
      <div className="mb-2 flex items-center justify-between">
        <IconComponent style={{ width: '20px', height: '20px', color }} />
        <span className={`text-xl font-bold ${textColor}`}>{value}</span>
      </div>
      <div className={`text-xs ${mutedColor}`}>{label}</div>
    </div>
  );
};
