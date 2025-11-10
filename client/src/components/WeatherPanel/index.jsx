/**
 * Refactored Weather Panel Component
 * Following SOLID principles:
 * - Single Responsibility: Manages weather display logic and state
 * - Uses composition with smaller UI components
 * - Separates concerns: data fetching (hook) vs presentation
 */

import { useState } from 'react';
import { RefreshCw, Wind, Droplets, Cloud } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';
import { useWeatherData } from '../../hooks/useWeatherData';
import { getWeatherIcon, getUVColor } from './utils/weatherHelpers.jsx';
import MinimizedView from './components/MinimizedView';
import Header from './components/Header';
import MetricCard from './components/MetricCard';

const WeatherPanel = ({ isDarkMode = false, currentLocation = null }) => {
  const { isMobile, getPanelWidth } = useResponsive();
  const [isMinimized, setIsMinimized] = useState(false);

  // Get real weather data from API
  const { weatherData, loading, error, refreshWeather } = useWeatherData(currentLocation);

  if (isMinimized) {
    return (
      <MinimizedView
        isDarkMode={isDarkMode}
        weatherData={weatherData}
        isMobile={isMobile}
        onExpand={() => setIsMinimized(false)}
      />
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
        <Header
          isDarkMode={isDarkMode}
          loading={loading}
          onRefresh={refreshWeather}
          onMinimize={() => setIsMinimized(true)}
        />

        {/* Content */}
        <div style={{ padding: '16px' }}>
          {loading ? (
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
                  gap: '8px',
                  flex: '1',
                  flexWrap: 'nowrap',
                  alignItems: 'stretch',
                  justifyContent: 'space-evenly',
                  maxWidth: '100%',
                }}
              >
                <MetricCard
                  icon={
                    <Wind
                      style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0 }}
                    />
                  }
                  value={`${weatherData.windSpeed ?? 0} km/h`}
                  label="Wind"
                  isDarkMode={isDarkMode}
                />
                <MetricCard
                  icon={
                    <Droplets
                      style={{ width: '16px', height: '16px', color: '#3b82f6', flexShrink: 0 }}
                    />
                  }
                  value={`${weatherData.humidity ?? 0}%`}
                  label="Humidity"
                  isDarkMode={isDarkMode}
                />
                <MetricCard
                  icon={
                    <Cloud
                      style={{
                        width: '16px',
                        height: '16px',
                        color: getUVColor(weatherData.uvIndex),
                        flexShrink: 0,
                      }}
                    />
                  }
                  value={weatherData.uvIndex ?? 0}
                  label="UV"
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherPanel;
