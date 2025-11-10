/**
 * Configuration for different transportation modes
 */

export const MODE_CONFIG = {
  driving: { icon: '🚗', name: 'Driving', color: '#dc2626' },
  transit: { icon: '🚌', name: 'Transit', color: '#2563eb' },
  bicycling: { icon: '🚴', name: 'Biking', color: '#16a34a' },
  walking: { icon: '🚶', name: 'Walking', color: '#7c3aed' },
};

/**
 * Get configuration for a transportation mode
 * @param {string} mode - Transportation mode
 * @returns {object} Mode configuration
 */
export const getModeConfig = (mode) => {
  return MODE_CONFIG[mode] || { icon: '🗺️', name: mode, color: '#6b7280' };
};
