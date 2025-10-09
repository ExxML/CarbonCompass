import React, { useState } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
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

    const conditionLower = condition.toLowerCase();
    
    // Clear/Sunny conditions
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return <Sun style={{ width: '24px', height: '24px', color: '#f59e0b' }} />;
    }
    
    // Rain conditions
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
      return <CloudRain style={{ width: '24px', height: '24px', color: '#3b82f6' }} />;
    }
    
    // Thunderstorm
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return <Zap style={{ width: '24px', height: '24px', color: '#8b5cf6' }} />;
    }
    
    // Wind
    if (conditionLower.includes('wind')) {
      return <Wind style={{ width: '24px', height: '24px', color: '#10b981' }} />;
    }
    
    // Cloudy (default)
    return <Cloud style={{ width: '24px', height: '24px', color: '#6b7280' }} />;
  };

  const getUVIndexInfo = (uvIndex) => {
    const uv = uvIndex ?? 0;
    if (uv <= 3) return '#10b981';
    if (uv <= 7) return '#f59e0b';
    return '#f97316';  // If uv > 7
  };

  if (isMinimized) {
    return (
      <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 9999 }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
            padding: '8px',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onClick={() => setIsMinimized(false)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', pointerEvents: 'none' }}>
            {getWeatherIcon(displayData.condition)}
            <span
              style={{
                fontSize: '13px',
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
          backdropFilter: 'blur(12px)',
          borderRadius: isMobile ? '8px' : '12px',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          width: `${getPanelWidth(170)}px`,
          padding: isMobile ? '8px' : '10px',
        }}
      >
        {/* Header with Location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              {getWeatherIcon(displayData?.condition)}
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Weather
              </span>
            </div>
            <div
              style={{
                fontSize: '13px',
                color: isDarkMode ? '#d1d5db' : '#6b7280',
                fontFamily: 'Roboto, sans-serif',
                marginLeft: '30px',
              }}
            >
              {displayData?.location || 'Unknown Location'}
              {error && (
                <span style={{ color: '#f59e0b', fontSize: '10px', marginLeft: '4px' }}>
                  (Unavailable)
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={refreshWeather}
              style={{
                padding: '3px',
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
                  width: '14px',
                  height: '14px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  transform: loading ? 'rotate(360deg)' : 'rotate(0deg)',
                  transition: 'transform 0.5s ease',
                }}
              />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              style={{
                padding: '3px',
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
                style={{ width: '14px', height: '14px', color: isDarkMode ? '#d1d5db' : '#6b7280' }}
              />
            </button>
          </div>
        </div>

        {/* Main Temperature - Compact */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
                lineHeight: '1',
              }}
            >
              {displayData?.temperature ?? '--'}°C
            </span>
            <div
              style={{
                fontSize: '12px',
                color: isDarkMode ? '#d1d5db' : '#6b7280',
                fontFamily: 'Roboto, sans-serif',
                marginTop: '4px',
              }}
            >
              {displayData?.condition || 'Unknown'}
            </div>
          </div>
          <div style={{ fontSize: '48px', lineHeight: '1', opacity: 0.9 }}>{getWeatherIcon(displayData?.condition)}</div>
        </div>

        {/* Weather Details - Compact Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '6px',
          }}
        >
          {/* Humidity */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 4px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <Droplets style={{ width: '16px', height: '16px', color: '#3b82f6', marginBottom: '4px' }} />
            <div
              style={{
                fontSize: '12px',
                color: isDarkMode ? '#d1d5db' : '#6b7280',
                fontFamily: 'Roboto, sans-serif',
                marginBottom: '2px',
              }}
            >
              Humidity
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {displayData?.humidity ?? '--'}%
            </div>
          </div>

          {/* Wind Speed */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 4px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <Wind style={{ width: '16px', height: '16px', color: '#10b981', marginBottom: '4px' }} />
            <div
              style={{
                fontSize: '12px',
                color: isDarkMode ? '#d1d5db' : '#6b7280',
                fontFamily: 'Roboto, sans-serif',
                marginBottom: '2px',
              }}
            >
              Wind
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
                textAlign: 'center',
                lineHeight: '1.2',
              }}
            >
              {displayData?.windSpeed ?? '--'}
              <span style={{ fontSize: '10px', fontWeight: '400' }}> km/h</span>
            </div>
          </div>

          {/* UV Index */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 4px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <Zap
              style={{
                width: '16px',
                height: '16px',
                color: getUVIndexInfo(displayData?.uvIndex),
                marginBottom: '4px',
              }}
            />
            <div
              style={{
                fontSize: '12px',
                color: isDarkMode ? '#d1d5db' : '#6b7280',
                fontFamily: 'Roboto, sans-serif',
                marginBottom: '2px',
              }}
            >
              UV Index
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
                textAlign: 'center',
              }}
            >
              {displayData?.uvIndex ?? '--'}
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
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            width: '170px',
            padding: '12px',
          }}
        >
          <div
            style={{
              color: props.isDarkMode ? '#f9fafb' : '#111827',
              fontSize: '13px',
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
