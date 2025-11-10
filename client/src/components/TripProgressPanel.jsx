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

  const positionStyle = isMobile
    ? { position: 'fixed', top: '50%', right: '8px', transform: 'translateY(-50%)', zIndex: 9999 }
    : { position: 'fixed', top: '50%', right: '16px', transform: 'translateY(-50%)', zIndex: 9999 };

  return (
    <div style={positionStyle}>
      <div
        className={isMobile ? 'glass-panel-mobile' : 'glass-panel'}
        style={{
          width: `${getPanelWidth(320)}px`,
          padding: '16px',
        }}
      >
        {/* Compact Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Navigation style={{ width: '18px', height: '18px', color: '#10b981' }} />
            </div>
            <span
              style={{
                fontSize: '15px',
                fontWeight: '600',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Trip Progress
            </span>
          </div>
          <button
            onClick={onStopTracking}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(239, 68, 68, 0.15)',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <StopCircle style={{ width: '14px', height: '14px', color: '#ef4444' }} />
            <span
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#ef4444',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Stop
            </span>
          </button>
        </div>

        {/* ETA Display */}
        <div
          style={{
            background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '12px',
            textAlign: 'center',
            border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)'}`,
          }}
        >
          <div
            style={{
              fontSize: '11px',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              marginBottom: '4px',
              fontFamily: 'Roboto, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Estimated Arrival
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#10b981',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {formatArrival(tripProgress?.eta)}
          </div>
        </div>

        {/* Progress Metrics - Compact Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {/* Distance */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              borderRadius: '8px',
              border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Route style={{ width: '16px', height: '16px', color: '#3b82f6', flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '13px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Distance
              </span>
            </div>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {formatDistance(tripProgress?.distanceRemaining)}
            </span>
          </div>

          {/* Time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
              borderRadius: '8px',
              border: `1px solid ${isDarkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock style={{ width: '16px', height: '16px', color: '#f59e0b', flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '13px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Time Left
              </span>
            </div>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {formatDuration(tripProgress?.timeRemaining)}
            </span>
          </div>

          {/* Progress Percentage */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
              borderRadius: '8px',
              border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '13px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Progress
              </span>
            </div>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#10b981',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {tripProgress?.percentComplete || 0}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '9999px',
            height: '6px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '6px',
              borderRadius: '9999px',
              background: 'linear-gradient(90deg, #10b981, #34d399)',
              transition: 'all 0.5s ease',
              width: `${tripProgress?.percentComplete || 0}%`,
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
            }}
          />
        </div>

        {/* Current Location Info */}
        {currentLocation && (
          <div
            style={{
              marginTop: '10px',
              fontSize: '10px',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              textAlign: 'center',
              fontFamily: 'Roboto, sans-serif',
              opacity: 0.7,
            }}
          >
            {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripProgressPanel;
