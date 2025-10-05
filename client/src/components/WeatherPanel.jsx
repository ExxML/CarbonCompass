import React, { useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, X } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';

const WeatherPanel = ({ isDarkMode = false }) => {
  // Responsive hook
  const { getPanelWidth, isMobile } = useResponsive();
  const [isMinimized, setIsMinimized] = useState(false);
  // Mock weather data - you can replace this with actual API data
  const weatherData = {
    location: 'Vancouver, BC',
    temperature: 18,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    uvIndex: 3,
  };

  const getWeatherIcon = (condition) => {
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
            {getWeatherIcon(weatherData.condition)}
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: isDarkMode ? '#f9fafb' : '#374151',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {weatherData.temperature}°C
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
            {getWeatherIcon(weatherData.condition)}
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

        {/* Location */}
        <div style={{ marginBottom: '16px' }}>
          <span
            style={{
              fontSize: '14px',
              color: isDarkMode ? '#d1d5db' : '#6b7280',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {weatherData.location}
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
              {weatherData.temperature}°C
            </span>
            <div
              style={{
                fontSize: '14px',
                color: isDarkMode ? '#d1d5db' : '#6b7280',
                fontFamily: 'Roboto, sans-serif',
                marginTop: '4px',
              }}
            >
              {weatherData.condition}
            </div>
          </div>
          <div style={{ fontSize: '48px' }}>{getWeatherIcon(weatherData.condition)}</div>
        </div>

        {/* Weather Details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          {/* Humidity */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <Droplets style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
            <div>
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
                {weatherData.humidity}%
              </div>
            </div>
          </div>

          {/* Wind Speed */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <Wind style={{ width: '16px', height: '16px', color: '#10b981' }} />
            <div>
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
                {weatherData.windSpeed} km/h
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPanel;
