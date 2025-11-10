import { Cloud } from 'lucide-react';

/**
 * Get weather icon based on condition
 */
export const getWeatherIcon = (condition) => {
  if (!condition) return <Cloud style={{ width: '40px', height: '40px', color: '#6b7280' }} />;
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('clear') || conditionLower.includes('sunny'))
    return <Cloud style={{ width: '40px', height: '40px', color: '#f59e0b' }} />;
  if (conditionLower.includes('rain'))
    return <Cloud style={{ width: '40px', height: '40px', color: '#3b82f6' }} />;
  return <Cloud style={{ width: '40px', height: '40px', color: '#6b7280' }} />;
};

/**
 * Get UV index color
 */
export const getUVColor = (uvIndex) => {
  const uv = uvIndex ?? 0;
  if (uv <= 2) return '#10b981'; // Low - green
  if (uv <= 5) return '#f59e0b'; // Moderate - yellow
  return '#ef4444'; // High - red
};
