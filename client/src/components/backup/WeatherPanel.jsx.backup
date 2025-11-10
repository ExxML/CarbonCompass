/**
 * Refactored Weather Panel Component
 * Following SOLID principles:
 * - Single Responsibility: Manages weather display logic and state
 * - Uses composition with smaller UI components
 * - Separates concerns: data fetching (hook) vs presentation
 */

import React, { useState } from 'react';
import { Cloud, RefreshCw, Wind, Droplets, X } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import { useWeatherData } from '../hooks/useWeatherData';

const WeatherPanel = ({ isDarkMode = false, currentLocation = null }) => {
  const { isMobile, getPanelWidth } = useResponsive();
  const [isMinimized, setIsMinimized] = useState(false);

  // Get real weather data from API
  const { weatherData, loading, error, refreshWeather } = useWeatherData(currentLocation);

  const getUVColor = (uvIndex) => {
    const uv = uvIndex ?? 0;
    if (uv <= 2) return '#10b981'; // Low - green
    if (uv <= 5) return '#f59e0b'; // Moderate - yellow
    return '#ef4444'; // High - red
  };

  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud style={{ width: '40px', height: '40px', color: '#6b7280' }} />;
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sunny'))
      return <Cloud style={{ width: '40px', height: '40px', color: '#f59e0b' }} />;
    if (conditionLower.includes('rain'))
      return <Cloud style={{ width: '40px', height: '40px', color: '#3b82f6' }} />;
    return <Cloud style={{ width: '40px', height: '40px', color: '#6b7280' }} />;
  };

  if (isMinimized) {
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
          onClick={() => setIsMinimized(false)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
            <Cloud style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: isDarkMode ? '#f9fafb' : '#374151',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {weatherData?.temperature ?? '--'}°C
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
        maxWidth: isMobile ? 'calc(100vw - 16px)' : '500px',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: isMobile ? '12px' : '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: isMobile ? '100%' : `${getPanelWidth(384)}px`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cloud style={{ width: '20px', height: '20px', color: '#6b7280' }} />
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
              disabled={loading}
              style={{
                padding: '4px',
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                opacity: loading ? 0.5 : 1,
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = isDarkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : '#f3f4f6';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <RefreshCw
                style={{
                  width: '16px',
                  height: '16px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  animation: loading ? 'spin 1s linear infinite' : 'none',
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
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : '#f3f4f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X
                style={{ width: '16px', height: '16px', color: isDarkMode ? '#d1d5db' : '#6b7280' }}
              />
            </button>
          </div>
        </div>

        {/* Main Content */}
        {/* Content */}
        <div style={{ padding: '16px' }}>
          {loading && !weatherData.temperature ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 0',
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              <RefreshCw
                style={{
                  width: '20px',
                  height: '20px',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <span>Loading weather...</span>
            </div>
          ) : error ? (
            <div
              style={{
                padding: '8px 0',
                textAlign: 'center',
                color: '#ef4444',
                fontSize: '14px',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Unable to load weather data
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                justifyContent: 'space-between',
              }}
            >
              {/* Current Temperature - Main Display */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingRight: isMobile ? '0' : '10px',
                  borderRight: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  flex: isMobile ? '1 1 100%' : '0 0 auto',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                }}
              >
                {getWeatherIcon(weatherData.condition)}
                <div>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: isDarkMode ? '#f9fafb' : '#111827',
                      fontFamily: 'Roboto, sans-serif',
                      lineHeight: '1',
                    }}
                  >
                    {weatherData.temperature ?? '--'}°
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      marginTop: '2px',
                      fontFamily: 'Roboto, sans-serif',
                    }}
                  >
                    {weatherData.condition || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Weather Metrics - Horizontal Layout */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flex: '1',
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Wind Speed - Compact */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    minWidth: '0',
                    flex: '1',
                  }}
                >
                  <Wind
                    style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0 }}
                  />
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '0' }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: isDarkMode ? '#f9fafb' : '#111827',
                        fontFamily: 'Roboto, sans-serif',
                        lineHeight: '1.2',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {weatherData.windSpeed ?? 0}
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        color: isDarkMode ? '#9ca3af' : '#6b7280',
                        fontFamily: 'Roboto, sans-serif',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      km/h
                    </span>
                  </div>
                </div>

                {/* Humidity - Compact */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    minWidth: '0',
                    flex: '1',
                  }}
                >
                  <Droplets
                    style={{ width: '16px', height: '16px', color: '#3b82f6', flexShrink: 0 }}
                  />
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '0' }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: isDarkMode ? '#f9fafb' : '#111827',
                        fontFamily: 'Roboto, sans-serif',
                        lineHeight: '1.2',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {weatherData.humidity ?? 0}%
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        color: isDarkMode ? '#9ca3af' : '#6b7280',
                        fontFamily: 'Roboto, sans-serif',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Humidity
                    </span>
                  </div>
                </div>

                {/* UV Index - Compact */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    minWidth: '0',
                    flex: '1',
                  }}
                >
                  <Cloud
                    style={{
                      width: '16px',
                      height: '16px',
                      color: getUVColor(weatherData.uvIndex),
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '0' }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: isDarkMode ? '#f9fafb' : '#111827',
                        fontFamily: 'Roboto, sans-serif',
                        lineHeight: '1.2',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {weatherData.uvIndex ?? 0}
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        color: isDarkMode ? '#9ca3af' : '#6b7280',
                        fontFamily: 'Roboto, sans-serif',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      UV
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherPanel;
