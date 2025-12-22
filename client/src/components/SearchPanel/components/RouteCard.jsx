/**
 * Configuration for each transportation mode
 */
const MODE_CONFIG = {
  driving: { icon: '🚗', name: 'Driving', color: '#dc2626' },
  transit: { icon: '🚌', name: 'Transit', color: '#2563eb' },
  bicycling: { icon: '🚴', name: 'Biking', color: '#16a34a' },
  walking: { icon: '🚶', name: 'Walking', color: '#7c3aed' },
};

/**
 * Individual route card for a transportation mode
 * Shows route details and carbon emissions
 */
const RouteCard = ({ mode, routeData, onSelect, isDarkMode }) => {
  const config = MODE_CONFIG[mode] || { icon: '🗺️', name: mode, color: '#6b7280' };
  const route = routeData?.routes?.[0];

  // Route not available
  if (!routeData || !route) {
    return (
      <div
        key={mode}
        className="flex items-center justify-center px-3 py-2.5 bg-gray-500/10 rounded-lg opacity-60 relative"
        style={{ border: `1px solid ${config.color}` }}
      >
        {/* Left side - Icon */}
        <div className="absolute left-3 flex items-center">
          <span className="text-lg grayscale">{config.icon}</span>
        </div>

        {/* Center - Transportation mode and details */}
        <div className="text-center">
          <div
            className={`text-sm font-medium font-['Roboto'] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
          >
            {config.name}
          </div>
          <div
            className={`text-xs font-['Roboto'] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
          >
            Route not available
          </div>
        </div>

        {/* Right side - N/A */}
        <div className="absolute right-3 text-right">
          <div className="text-[13px] font-semibold text-gray-500 font-['Roboto']">N/A</div>
        </div>
      </div>
    );
  }

  // Route available
  const emissions = route.carbon_emissions;

  return (
    <div
      key={mode}
      className="flex items-center justify-center px-3 py-2.5 bg-white/10 rounded-lg relative cursor-pointer"
      style={{ border: `2px solid ${config.color}` }}
      onClick={() => onSelect && onSelect(mode, routeData)}
    >
      {/* Left side - Icon */}
      <div className="absolute left-3 flex items-center">
        <span className="text-lg">{config.icon}</span>
      </div>

      {/* Center - Transportation mode and details */}
      <div className="text-center">
        <div
          className={`text-sm font-medium font-['Roboto'] ${isDarkMode ? 'text-gray-50' : 'text-gray-900'
            }`}
        >
          {config.name}
        </div>
        <div
          className={`text-xs font-['Roboto'] ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
        >
          {route.distance?.text} • {route.duration?.text}
        </div>
      </div>

      {/* Right side - Emissions */}
      <div className="absolute right-3 text-right">
        <div
          className="text-[13px] font-semibold font-['Roboto']"
          style={{ color: emissions?.emissions_kg === 0 ? '#16a34a' : config.color }}
        >
          {emissions?.emissions_kg === 0 ? '0 kg CO₂' : `${emissions?.emissions_kg || 0} kg CO₂`}
        </div>
        <div
          className={`text-[11px] font-['Roboto'] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
        >
          emissions
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
