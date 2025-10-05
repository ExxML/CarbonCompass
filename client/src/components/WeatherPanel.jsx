import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';

const WeatherPanel = ({ isDarkMode = false }) => {
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
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
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
