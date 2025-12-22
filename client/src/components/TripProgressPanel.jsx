/**
 * Refactored Trip Progress Panel Component
 * Following SOLID principles:
 * - Single Responsibility: Displays trip progress
 * - Uses composition with smaller UI components
 * - Clean separation of presentation from logic
 */

import { Navigation, MapPin, Clock, Route, StopCircle } from 'lucide-react';
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

  if (!isTracking) {
    return null;
  }

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

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-[9999] ${isMobile ? 'right-2' : 'right-4'
        }`}
    >
      <div
        className={isMobile ? 'glass-panel-mobile p-4' : 'glass-panel p-4'}
        style={{ width: `${getPanelWidth(320)}px` }}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/15 rounded-lg p-1.5 flex items-center justify-center">
              <Navigation className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <span
              className={`text-[15px] font-semibold font-['Roboto'] ${isDarkMode ? 'text-gray-50' : 'text-gray-900'
                }`}
            >
              Trip Progress
            </span>
          </div>
          <button
            onClick={onStopTracking}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 rounded-lg border border-red-500/30 cursor-pointer transition-all duration-200 hover:bg-red-500/25 hover:scale-[1.02]"
          >
            <StopCircle className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[13px] font-medium text-red-500 font-['Roboto']">Stop</span>
          </button>
        </div>

        {/* ETA Display */}
        <div
          className={`rounded-[10px] p-3 mb-3 text-center ${isDarkMode
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : 'bg-emerald-500/5 border border-emerald-500/15'
            }`}
        >
          <div
            className={`text-[11px] mb-1 font-['Roboto'] uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
          >
            Estimated Arrival
          </div>
          <div className="text-[28px] font-bold text-emerald-500 font-['Roboto']">
            {formatArrival(tripProgress?.eta)}
          </div>
        </div>

        {/* Progress Metrics - Compact Grid */}
        <div className="flex flex-col gap-2 mb-3">
          {/* Distance */}
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${isDarkMode
                ? 'bg-blue-500/10 border border-blue-500/20'
                : 'bg-blue-500/5 border border-blue-500/15'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Route className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span
                className={`text-[13px] font-['Roboto'] ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}
              >
                Distance
              </span>
            </div>
            <span
              className={`text-sm font-semibold font-['Roboto'] ${isDarkMode ? 'text-gray-50' : 'text-gray-900'
                }`}
            >
              {formatDistance(tripProgress?.distanceRemaining)}
            </span>
          </div>

          {/* Time */}
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${isDarkMode
                ? 'bg-amber-500/10 border border-amber-500/20'
                : 'bg-amber-500/5 border border-amber-500/15'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span
                className={`text-[13px] font-['Roboto'] ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}
              >
                Time Left
              </span>
            </div>
            <span
              className={`text-sm font-semibold font-['Roboto'] ${isDarkMode ? 'text-gray-50' : 'text-gray-900'
                }`}
            >
              {formatDuration(tripProgress?.timeRemaining)}
            </span>
          </div>

          {/* Progress Percentage */}
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${isDarkMode
                ? 'bg-emerald-500/10 border border-emerald-500/20'
                : 'bg-emerald-500/5 border border-emerald-500/15'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span
                className={`text-[13px] font-['Roboto'] ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}
              >
                Progress
              </span>
            </div>
            <span className="text-sm font-semibold text-emerald-500 font-['Roboto']">
              {tripProgress?.percentComplete || 0}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className={`rounded-full h-1.5 overflow-hidden relative ${isDarkMode ? 'bg-white/5' : 'bg-black/5'
            }`}
        >
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
            style={{ width: `${tripProgress?.percentComplete || 0}%` }}
          />
        </div>

        {/* Current Location Info */}
        {currentLocation && (
          <div
            className={`mt-2.5 text-[10px] text-center font-['Roboto'] opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
          >
            {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripProgressPanel;
