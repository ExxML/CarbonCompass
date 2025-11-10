/**
 * Metric Configuration
 * Defines styling for different carbon metrics
 */

import { TrendingDown, TreePine, Car } from 'lucide-react';

export const getMetricConfig = (type) => {
  const configs = {
    reduction: {
      icon: TrendingDown,
      bgColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      iconColor: '#10b981',
      label: 'Reduce',
    },
    trees: {
      icon: TreePine,
      bgColor: 'rgba(22, 163, 74, 0.15)',
      borderColor: 'rgba(22, 163, 74, 0.3)',
      iconColor: '#16a34a',
      label: 'Trees',
    },
    trip: {
      icon: Car,
      bgColor: 'rgba(37, 99, 235, 0.15)',
      borderColor: 'rgba(37, 99, 235, 0.3)',
      iconColor: '#2563eb',
      label: 'Trip',
    },
  };

  return configs[type] || configs.reduction;
};
