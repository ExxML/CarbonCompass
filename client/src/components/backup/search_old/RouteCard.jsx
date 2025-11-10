/**
 * Route Card Component
 * Single Responsibility: Display a single transportation route option
 */

import React from 'react';

export const RouteCard = ({ mode, config, route, onSelect, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const mutedColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  if (!route) {
    return (
      <div
        className="route-card opacity-60 border-2"
        style={{ borderColor: config.color }}
      >
        {/* Left side - Icon */}
        <div className="absolute left-3 flex items-center">
          <span className="text-lg grayscale">{config.icon}</span>
        </div>

        {/* Center - Transportation mode */}
        <div className="text-center">
          <div className={`text-sm font-medium ${mutedColor}`}>{config.name}</div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            Route not available
          </div>
        </div>

        {/* Right side - N/A */}
        <div className="absolute right-3 text-right">
          <div className="text-[13px] font-semibold text-gray-600">N/A</div>
        </div>
      </div>
    );
  }

  const emissions = route.carbon_emissions;
  const emissionsColor = emissions?.emissions_kg === 0 ? '#16a34a' : config.color;

  return (
    <div
      className="route-card border-2 hover:border-opacity-80"
      style={{ borderColor: config.color }}
      onClick={() => onSelect(mode, route)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(mode, route)}
    >
      {/* Left side - Icon */}
      <div className="absolute left-3 flex items-center">
        <span className="text-lg">{config.icon}</span>
      </div>

      {/* Center - Transportation mode and details */}
      <div className="text-center">
        <div className={`text-sm font-medium ${textColor}`}>{config.name}</div>
        <div className={`text-xs ${mutedColor}`}>
          {route.distance?.text} • {route.duration?.text}
        </div>
      </div>

      {/* Right side - Emissions */}
      <div className="absolute right-3 text-right">
        <div
          className="text-[13px] font-semibold"
          style={{ color: emissionsColor }}
        >
          {emissions?.emissions_kg === 0
            ? '0 kg CO₂'
            : `${emissions?.emissions_kg || 0} kg CO₂`}
        </div>
        <div className={`text-[11px] ${mutedColor}`}>emissions</div>
      </div>
    </div>
  );
};
