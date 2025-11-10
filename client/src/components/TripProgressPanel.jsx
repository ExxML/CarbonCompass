/**
 * Refactored Trip Progress Panel Component
 * Following SOLID principles:
 * - Single Responsibility: Displays trip progress
 * - Uses composition with smaller UI components
 * - Clean separation of presentation from logic
 */

import { Navigation, MapPin, Clock, Route, StopCircle } from 'lucide-react';
import { PanelHeader, MetricDisplay, Divider } from './ui/SharedComponents';
import { useResponsive } from '../hooks/useResponsive';
import { formatDuration, formatDistance } from '../utils/tripTrackingUtils';

const TripProgressPanel = ({
  isDarkMode = false,
  tripProgress,
  currentLocation,
  isTracking,
  onStopTracking,
}) => {
  const { getPanelWidth, isMobile } = useResponsive();

  if (!isTracking) return null;

  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const mutedColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  const formatArrival = (date) => {
    if (!date) return '--:--';
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return '--:--';
      return parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '--:--';
  };

  const position = isMobile
    ? 'fixed top-[26px] right-2 z-[9999]'
    : 'fixed top-[198px] right-4 z-[9999]';

  return (
    <div className={position}>
      <div
        className={isMobile ? 'glass-panel-mobile' : 'glass-panel'}
        style={{ width: `${getPanelWidth(320)}px`, padding: isMobile ? '12px' : '16px' }}
      >
        {/* Header with Stop Button */}
        <div className="flex items-center justify-between border-b border-white/25 p-4">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-emerald-600" />
            <span className={`text-base font-medium ${textColor}`}>Trip Progress</span>
          </div>
          <button onClick={onStopTracking} className="btn-danger">
            <StopCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Stop</span>
          </button>
        </div>

        {/* Progress Content */}
        <div className="p-4">
          {/* ETA Display */}
          <div className="mb-4 text-center">
            <div className={`text-xs ${mutedColor} mb-1`}>Estimated Arrival</div>
            <div className={`text-4xl font-bold ${textColor}`}>
              {formatArrival(tripProgress?.eta)}
            </div>
          </div>

          <Divider />

          {/* Progress Metrics */}
          <div className="space-y-3">
            <MetricDisplay
              icon={Route}
              label="Distance Remaining"
              value={formatDistance(tripProgress?.distanceRemaining)}
              color="#3b82f6"
              isDarkMode={isDarkMode}
            />
            <MetricDisplay
              icon={Clock}
              label="Time Remaining"
              value={formatDuration(tripProgress?.timeRemaining)}
              color="#f59e0b"
              isDarkMode={isDarkMode}
            />
            <MetricDisplay
              icon={MapPin}
              label="Progress"
              value={`${tripProgress?.percentComplete || 0}%`}
              color="#10b981"
              isDarkMode={isDarkMode}
            />
          </div>

          <Divider />

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${tripProgress?.percentComplete || 0}%` }}
              />
            </div>
          </div>

          {/* Current Location Info */}
          {currentLocation && (
            <div className={`mt-3 text-xs ${mutedColor} text-center`}>
              Current: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripProgressPanel;
