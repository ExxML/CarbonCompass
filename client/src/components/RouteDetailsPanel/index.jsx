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
    <div className="fixed z-[9998]" style={{ ...position }}>
      <div
        className={`bg-white/10 backdrop-blur-[15px] ${isMobile ? 'rounded-xl' : 'rounded-2xl'} flex max-h-[calc(100vh-32px)] flex-col border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]`}
        style={{ width: `${getPanelWidth(384)}px` }}
      >
        <Header config={config} isDarkMode={isDarkMode} onClose={onClose} />

        {/* Route Summary */}
        <div className="border-b border-white/15 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div
              className={`font-['Roboto'] text-xl font-semibold ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
            >
              {route.distance?.text || 'N/A'}
            </div>
            <div className="font-['Roboto'] text-base font-medium" style={{ color: config.color }}>
              {route.duration?.text || 'N/A'}
            </div>
          </div>
          {route.carbon_emissions && (
            <div
              className={`font-['Roboto'] text-xs ${route.carbon_emissions.emissions_kg === 0
                  ? 'text-emerald-500'
                  : isDarkMode
                    ? 'text-gray-300'
                    : 'text-gray-500'
                }`}
            >
              Carbon:{' '}
              {route.carbon_emissions.emissions_kg === 0
                ? '0 kg CO₂'
                : `${route.carbon_emissions.emissions_kg} kg CO₂`}
            </div>
          )}
        </div>

        {/* Scrollable Directions */}
        <div className="transparent-scrollbar flex-1 overflow-y-auto p-4">
          <div
            className={`mb-3 text-sm font-semibold ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
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
