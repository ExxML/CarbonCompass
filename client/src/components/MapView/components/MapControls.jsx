/**
 * MapControls Component
 * Container for all map control buttons
 * New order: Home -> Traffic -> Dark Mode
 */

import { Home, Navigation, Moon, Sun } from 'lucide-react';
import MapButton from './MapButton';

const MapControls = ({
  onNavigateToLanding,
  showTraffic,
  onToggleTraffic,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <>
      {/* Home Button - Position 0 */}
      {onNavigateToLanding && (
        <MapButton
          icon={Home}
          label="Home"
          onClick={onNavigateToLanding}
          isActive={false}
          activeColor="#10b981"
          iconColor="#10b981"
          position={0}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Traffic Button - Position 1 */}
      <MapButton
        icon={Navigation}
        label={showTraffic ? 'Hide Traffic' : 'Show Traffic'}
        onClick={onToggleTraffic}
        isActive={showTraffic}
        activeColor="#dc2626"
        iconColor={showTraffic ? '#dc2626' : '#6b7280'}
        position={1}
        isDarkMode={isDarkMode}
      />

      {/* Dark Mode Button - Position 2 */}
      <MapButton
        icon={isDarkMode ? Sun : Moon}
        label={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        onClick={onToggleDarkMode}
        isActive={isDarkMode}
        activeColor="#1f2937"
        iconColor={isDarkMode ? '#9ca3af' : '#f59e0b'}
        activeIconColor="#9ca3af"
        position={2}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default MapControls;
