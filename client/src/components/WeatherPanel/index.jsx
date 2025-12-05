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
  const [isMinimized, setIsMinimized] = useState(true);

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
      className={`fixed ${isMobile ? 'bottom-2 right-2' : 'bottom-4 right-4'} z-[9999] ${isMobile ? 'max-w-[calc(100vw-16px)]' : 'max-w-[500px]'
        }`}
    >
      <div
        className={`bg-white/10 backdrop-blur-[15px] ${isMobile ? 'rounded-xl' : 'rounded-2xl'
          } shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20`}
        style={{ width: isMobile ? '100%' : `${getPanelWidth(384)}px` }}
      >
        <Header
          isDarkMode={isDarkMode}
          loading={loading}
          onRefresh={refreshWeather}
          onMinimize={() => setIsMinimized(true)}
        />

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div
              className={`flex items-center justify-center gap-2 py-2 font-['Roboto'] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
            >
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading weather...</span>
            </div>
          ) : error ? (
            <div className="py-2 text-center text-red-500 text-sm font-['Roboto']">
              Unable to load weather data
            </div>
          ) : (
            <div
              className={`flex items-center gap-3 ${isMobile ? 'flex-wrap' : 'flex-nowrap'
                } justify-between`}
            >
              {/* Current Temperature - Main Display */}
              <div
                className={`flex items-center gap-2 ${isMobile
                    ? 'flex-[1_1_100%] justify-center'
                    : 'flex-[0_0_auto] pr-2.5 border-r border-white/20 justify-start'
                  }`}
              >
                {getWeatherIcon(weatherData.condition)}
                <div>
                  <div
                    className={`text-[32px] font-bold font-['Roboto'] leading-none ${isDarkMode ? 'text-gray-50' : 'text-gray-900'
                      }`}
                  >
                    {weatherData.temperature ?? '--'}°
                  </div>
                  <div
                    className={`text-xs mt-0.5 font-['Roboto'] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                  >
                    {weatherData.condition || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Weather Metrics - Horizontal Layout */}
              <div className="flex gap-2 flex-1 flex-nowrap items-stretch justify-evenly max-w-full">
                <MetricCard
                  icon={<Wind className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                  value={`${weatherData.windSpeed ?? 0} km/h`}
                  label="Wind"
                  isDarkMode={isDarkMode}
                />
                <MetricCard
                  icon={<Droplets className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                  value={`${weatherData.humidity ?? 0}%`}
                  label="Humidity"
                  isDarkMode={isDarkMode}
                />
                <MetricCard
                  icon={
                    <Cloud
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: getUVColor(weatherData.uvIndex) }}
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
