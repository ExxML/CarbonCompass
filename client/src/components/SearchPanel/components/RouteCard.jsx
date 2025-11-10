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
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 12px',
          background: 'rgba(107, 114, 128, 0.1)',
          borderRadius: '8px',
          border: `1px solid ${config.color}`,
          opacity: 0.6,
          position: 'relative',
        }}
      >
        {/* Left side - Icon */}
        <div
          style={{
            position: 'absolute',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '18px', filter: 'grayscale(1)' }}>{config.icon}</span>
        </div>

        {/* Center - Transportation mode and details */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {config.name}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: isDarkMode ? '#6b7280' : '#9ca3af',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Route not available
          </div>
        </div>

        {/* Right side - N/A */}
        <div
          style={{
            position: 'absolute',
            right: '12px',
            textAlign: 'right',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#6b7280',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            N/A
          </div>
        </div>
      </div>
    );
  }

  // Route available
  const emissions = route.carbon_emissions;

  return (
    <div
      key={mode}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 12px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        border: `2px solid ${config.color}`,
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={() => onSelect && onSelect(mode, routeData)}
    >
      {/* Left side - Icon */}
      <div
        style={{
          position: 'absolute',
          left: '12px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '18px' }}>{config.icon}</span>
      </div>

      {/* Center - Transportation mode and details */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: isDarkMode ? '#f9fafb' : '#111827',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {config.name}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: isDarkMode ? '#d1d5db' : '#6b7280',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {route.distance?.text} • {route.duration?.text}
        </div>
      </div>

      {/* Right side - Emissions */}
      <div
        style={{
          position: 'absolute',
          right: '12px',
          textAlign: 'right',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: emissions?.emissions_kg === 0 ? '#16a34a' : config.color,
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {emissions?.emissions_kg === 0 ? '0 kg CO₂' : `${emissions?.emissions_kg || 0} kg CO₂`}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          emissions
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
