import { useEffect } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { injectScrollbarStyles, removeScrollbarStyles } from './utils/styleUtils';
import { getModeConfig } from './utils/modeConfig';
import { getAdjacentPosition } from './utils/positionUtils';
import Header from './components/Header';
import StartButton from './components/StartButton';
import StepRenderer from './components/StepRenderer';

/**
 * RouteDetailsPanel Component
 * Shows detailed turn-by-turn directions for a selected route
 */
const RouteDetailsPanel = ({
  isDarkMode = false,
  selectedRoute,
  routeData,
  onClose,
  onStartTracking,
}) => {
  const { getPanelWidth, isMobile } = useResponsive();

  // Inject scrollbar styles
  useEffect(() => {
    injectScrollbarStyles();
    return () => removeScrollbarStyles();
  }, []);

  // If no route is selected or no data, don't render
  if (!selectedRoute || !routeData) {
    return null;
  }

  const route = routeData.routes?.[0];
  if (!route) {
    return null;
  }

  const config = getModeConfig(selectedRoute);
  const position = getAdjacentPosition(isMobile, getPanelWidth);

  // Get mode-specific title
  const getModeTitle = () => {
    if (selectedRoute === 'driving') return '🚗 Driving Directions';
    if (selectedRoute === 'transit') return '🚌 Transit Directions';
    if (selectedRoute === 'bicycling') return '🚴 Biking Directions';
    if (selectedRoute === 'walking') return '🚶 Walking Directions';
    return 'Directions';
  };

  return (
    <div
      style={{
        position: 'fixed',
        ...position,
        zIndex: 9998,
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: isMobile ? '12px' : '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: `${getPanelWidth(384)}px`,
          maxHeight: 'calc(100vh - 32px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header config={config} isDarkMode={isDarkMode} onClose={onClose} />

        {/* Route Summary */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {route.distance?.text || 'N/A'}
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: config.color,
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {route.duration?.text || 'N/A'}
            </div>
          </div>
          {route.carbon_emissions && (
            <div
              style={{
                fontSize: '12px',
                color:
                  route.carbon_emissions.emissions_kg === 0
                    ? '#10b981'
                    : isDarkMode
                      ? '#d1d5db'
                      : '#6b7280',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Carbon:{' '}
              {route.carbon_emissions.emissions_kg === 0
                ? '0 kg CO₂'
                : `${route.carbon_emissions.emissions_kg} kg CO₂`}
            </div>
          )}
        </div>

        {/* Scrollable Directions */}
        <div
          className="transparent-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              color: isDarkMode ? '#f9fafb' : '#111827',
            }}
          >
            {getModeTitle()}
          </div>
          {route.steps?.map((step, stepIndex) => (
            <StepRenderer
              key={stepIndex}
              step={step}
              stepIndex={stepIndex}
              mode={selectedRoute}
              isDarkMode={isDarkMode}
              totalSteps={route.steps.length}
            />
          ))}
        </div>

        <StartButton onStartTracking={onStartTracking} routeData={routeData} />
      </div>
    </div>
  );
};

export default RouteDetailsPanel;
