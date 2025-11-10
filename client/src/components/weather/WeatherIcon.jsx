/**
 * Weather Icon Component
 * Single Responsibility: Display weather condition icon
 */

import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Zap } from 'lucide-react';

export const WeatherIcon = ({ condition, size = 24 }) => {
  const getIcon = () => {
    if (!condition || typeof condition !== 'string') {
      return <Cloud className="text-gray-600" style={{ width: size, height: size }} />;
    }

    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return <Sun className="text-amber-500" style={{ width: size, height: size }} />;
    }

    if (
      conditionLower.includes('rain') ||
      conditionLower.includes('drizzle') ||
      conditionLower.includes('shower')
    ) {
      return <CloudRain className="text-blue-500" style={{ width: size, height: size }} />;
    }

    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return <Zap className="text-purple-600" style={{ width: size, height: size }} />;
    }

    if (conditionLower.includes('wind')) {
      return <Wind className="text-emerald-600" style={{ width: size, height: size }} />;
    }

    return <Cloud className="text-gray-600" style={{ width: size, height: size }} />;
  };

  return getIcon();
};
