import React from 'react';
import { MapPin, Clock, Route, Square, StopCircle, Navigation } from 'lucide-react';
import { formatDuration, formatDistance } from '../utils/tripTrackingUtils';
import { useResponsive } from '../hooks/useResponsive';

const TripProgressPanel = ({
  isDarkMode = false,
  tripProgress,
  currentLocation,
  isTracking,
  onStopTracking,
}) => {
  // Responsive hook - must be called before any conditional returns
  const { getPanelWidth, isMobile } = useResponsive();

  if (!isTracking) return null;

  // Debug logging
  console.log('TripProgressPanel tripProgress:', tripProgress);
  if (tripProgress) {
    console.log('tripProgress.eta:', tripProgress.eta, typeof tripProgress.eta);
  }

  const formatArrival = (date) => {
    console.log('formatArrival called with:', date, typeof date);
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
      style={{
        position: 'fixed',
        top: isMobile ? '26px' : '198px',
        right: isMobile ? '8px' : '16px',
        zIndex: 9999,
        transform: isMobile ? `translateY(${0 * 60}px)` : 'none',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: isMobile ? '12px' : '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: `${getPanelWidth(320)}px`,
          padding: isMobile ? '12px' : '16px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation style={{ width: '20px', height: '20px', color: '#10b981' }} />
            <span
              style={{
                fontSize: '16px',
                fontWeight: '500',
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
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(220, 38, 38, 0.8)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 0.8)';
            }}
          >
            <StopCircle style={{ width: '14px', height: '14px', color: 'white' }} />
            <span
              style={{
                fontSize: '12px',
                fontWeight: '500',
                color: 'white',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Stop
            </span>
          </button>
        </div>

        {/* Progress Bar */}
        {tripProgress && (
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${tripProgress.progressPercentage}%`,
                  height: '100%',
                  background: tripProgress.isOffRoute
                    ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                    : 'linear-gradient(90deg, #10b981, #059669)',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                {Math.round(tripProgress.progressPercentage || 0)}% complete
              </span>
              {tripProgress.isOffRoute && (
                <span
                  style={{
                    fontSize: '12px',
                    color: '#f59e0b',
                    fontFamily: 'Roboto, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <AlertTriangle style={{ width: '12px', height: '12px' }} />
                  Off route
                </span>
              )}
            </div>
          </div>
        )}

        {/* Trip Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          {/* Remaining Time */}
          <div
            style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Clock style={{ width: '14px', height: '14px', color: '#10b981' }} />
              <span
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Remaining
              </span>
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {tripProgress ? formatDuration(tripProgress.remainingTime) : '--'}
            </div>
          </div>

          {/* Remaining Distance */}
          <div
            style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <MapPin style={{ width: '14px', height: '14px', color: '#10b981' }} />
              <span
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Distance
              </span>
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {tripProgress ? formatDistance(tripProgress.remainingDistance) : '--'}
            </div>
          </div>
        </div>

        {/* Arrival Time */}
        {tripProgress && (
          <div
            style={{
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: isDarkMode ? '#10b981' : '#047857',
                fontFamily: 'Roboto, sans-serif',
                marginBottom: '2px',
              }}
            >
              Estimated Arrival
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: isDarkMode ? '#10b981' : '#047857',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {formatArrival(tripProgress.eta)}
            </div>
          </div>
        )}

        {/* Location Accuracy */}
        {currentLocation && (
          <div
            style={{
              marginTop: '8px',
              fontSize: '10px',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              textAlign: 'center',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Accuracy: ±{Math.round(currentLocation.accuracy)}m
          </div>
        )}
      </div>
    </div>
  );
};

export default TripProgressPanel;
