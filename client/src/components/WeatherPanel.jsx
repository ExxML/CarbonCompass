import React, { useState } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  X,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import { useWeatherData } from '../hooks/useWeatherData';

const WeatherPanelCore = ({ isDarkMode = false, currentLocation = null }) => {
  // Responsive hook
  const { getPanelWidth, isMobile } = useResponsive();
  const [isMinimized, setIsMinimized] = useState(false);

  // Get real weather data from API
  const { weatherData, loading, error, refreshWeather } = useWeatherData(currentLocation);

  // weatherData is now guaranteed to be a valid object with safe defaults
  const displayData = weatherData;

  const getWeatherIcon = (condition) => {
    if (!condition || typeof condition !== 'string') {
      return <Cloud style={{ width: '24px', height: '24px', color: '#6b7280' }} />;
    }

    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun style={{ width: '24px', height: '24px', color: '#f59e0b' }} />;
      case 'rainy':
      case 'rain':
        return <CloudRain style={{ width: '24px', height: '24px', color: '#3b82f6' }} />;
      case 'partly cloudy':
      case 'cloudy':
      default:
        return <Cloud style={{ width: '24px', height: '24px', color: '#6b7280' }} />;
    }
  };

  const getUVIndexInfo = (uvIndex) => {
    const uv = uvIndex ?? 0;
    if (uv <= 2) return { color: '#10b981', level: 'Low' };
    if (uv <= 5) return { color: '#f59e0b', level: 'Moderate' };
    if (uv <= 7) return { color: '#f97316', level: 'High' };
    if (uv <= 10) return { color: '#ef4444', level: 'Very High' };
    return { color: '#991b1b', level: 'Extreme' };
  };

  if (isMinimized) {
    return (
      <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 9999 }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            padding: '12px',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease',
          }}
          onClick={() => setIsMinimized(false)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
            {getWeatherIcon(displayData.condition)}
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: isDarkMode ? '#f9fafb' : '#374151',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {displayData?.temperature ?? '--'}°C
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isMobile ? '8px' : '16px',
        right: isMobile ? '8px' : '16px',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: isMobile ? '12px' : '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          width: `${getPanelWidth(280)}px`,
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
            {getWeatherIcon(displayData?.condition)}
            <span
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Weather
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={refreshWeather}
              style={{
                padding: '4px',
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s, transform 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : '#f3f4f6')
              }
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              title="Refresh weather data"
            >
              <RefreshCw
                style={{
                  width: '16px',
                  height: '16px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  transform: loading ? 'rotate(360deg)' : 'rotate(0deg)',
                  transition: 'transform 0.5s ease',
                }}
              />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              style={{
                padding: '4px',
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : '#f3f4f6')
              }
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <X
                style={{ width: '16px', height: '16px', color: isDarkMode ? '#d1d5db' : '#6b7280' }}
              />
            </button>
          </div>
        </div>

        {/* Location */}
        <div style={{ marginBottom: '16px' }}>
          <span
            style={{
              fontSize: '14px',
              color: isDarkMode ? '#d1d5db' : '#6b7280',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {displayData?.location || 'Unknown Location'}
            {error && (
              <span style={{ color: '#f59e0b', fontSize: '12px', marginLeft: '8px' }}>
                (Using cached data)
              </span>
            )}
          </span>
        </div>

        {/* Main Temperature */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {displayData?.temperature ?? '--'}°C
            </span>
            <div
              style={{
                fontSize: '14px',
                color: isDarkMode ? '#d1d5db' : '#6b7280',
                fontFamily: 'Roboto, sans-serif',
                marginTop: '4px',
              }}
            >
              {displayData?.condition || 'Unknown'}
            </div>
          </div>
          <div style={{ fontSize: '48px' }}>{getWeatherIcon(displayData?.condition)}</div>
        </div>

        {/* Weather Details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          {/* Humidity */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              minHeight: '52px',
            }}
          >
            <div style={{ paddingTop: '2px' }}>
              <Droplets style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Humidity
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                {displayData?.humidity ?? '--'}%
              </div>
            </div>
          </div>

          {/* Wind Speed */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              minHeight: '52px',
            }}
          >
            <div style={{ paddingTop: '2px' }}>
              <Wind style={{ width: '16px', height: '16px', color: '#10b981' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Wind
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                {displayData?.windSpeed ?? '--'} km/h
              </div>
            </div>
          </div>

          {/* UV Index */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              minHeight: '52px',
              ...(isMobile && { gridColumn: '1 / -1', marginTop: '12px' }),
            }}
          >
            <div style={{ paddingTop: '2px' }}>
              <Zap
                style={{
                  width: '16px',
                  height: '16px',
                  color: getUVIndexInfo(displayData?.uvIndex).color,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                UV Index
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  fontFamily: 'Roboto, sans-serif',
                  lineHeight: '1.2',
                }}
              >
                <div>{displayData?.uvIndex ?? '--'}</div>
                <div
                  style={{
                    fontSize: '10px',
                    color: getUVIndexInfo(displayData?.uvIndex).color,
                    fontWeight: '600',
                    marginTop: '1px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {getUVIndexInfo(displayData?.uvIndex).level}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error boundary wrapper
const WeatherPanel = (props) => {
  try {
    return <WeatherPanelCore {...props} />;
  } catch (error) {
    console.error('WeatherPanel error:', error);
    // Return a minimal fallback UI
    return (
      <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 9999 }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            width: '280px',
            padding: '16px',
          }}
        >
          <div
            style={{
              color: props.isDarkMode ? '#f9fafb' : '#111827',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            Weather unavailable
          </div>
        </div>
      </div>
    );
  }
};

export default WeatherPanel;
