/**
 * Application constants - centralized configuration values
 * Following Single Responsibility Principle - this file manages all constants
 */

// Panel dimensions
export const PANEL_DIMENSIONS = {
  BASE_WIDTH: 384,
  MOBILE_MAX_WIDTH: 320,
  TABLET_WIDTH_MULTIPLIER: 0.9,
  TABLET_MAX_WIDTH: 350,
  LARGE_DESKTOP_MULTIPLIER: 1.1,
  LARGE_DESKTOP_MAX_WIDTH: 420,
};

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  LARGE_DESKTOP: 1440,
};

// Spacing
export const SPACING = {
  PANEL_PADDING_MOBILE: 8,
  PANEL_PADDING_DESKTOP: 16,
  PANEL_GAP: 12,
  STACK_OFFSET: 60,
};

// Z-Index layers
export const Z_INDEX = {
  MAP: 1,
  PANELS: 9999,
  MODAL: 10000,
};

// Transportation modes configuration
export const TRANSPORT_MODES = {
  driving: {
    icon: '🚗',
    name: 'Driving',
    color: '#dc2626',
    googleMode: 'DRIVING',
  },
  transit: {
    icon: '🚌',
    name: 'Transit',
    color: '#2563eb',
    googleMode: 'TRANSIT',
  },
  bicycling: {
    icon: '🚴',
    name: 'Biking',
    color: '#16a34a',
    googleMode: 'BICYCLING',
  },
  walking: {
    icon: '🚶',
    name: 'Walking',
    color: '#7c3aed',
    googleMode: 'WALKING',
  },
};

// API configuration
export const API_CONFIG = {
  DEBOUNCE_DELAY: 500,
  LOCATION_TIMEOUT: 15000,
  LOCATION_MAX_AGE: 0,
  RECENT_SEARCHES_LIMIT: 3,
};

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 49.2606, lng: -123.246 },
  DEFAULT_ZOOM: 12,
};

// Theme colors (matching CSS variables)
export const THEME_COLORS = {
  LIGHT: {
    background: 'rgb(255 255 255)',
    surface: 'rgb(255 255 255)',
    text: 'rgb(17 24 39)',
    textMuted: 'rgb(100 116 139)',
    border: 'rgb(225 228 232)',
  },
  DARK: {
    background: 'rgb(15 15 18)',
    surface: 'rgb(24 24 28)',
    text: 'rgb(237 242 247)',
    textMuted: 'rgb(160 174 192)',
    border: 'rgb(56 60 67)',
  },
};

// Glass morphism styles (shared)
export const GLASS_STYLES = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

// Animation durations
export const ANIMATION = {
  FAST: '0.2s',
  NORMAL: '0.3s',
  SLOW: '0.5s',
};

// Local storage keys
export const STORAGE_KEYS = {
  RECENT_SEARCHES: 'recentSearches',
  THEME: 'theme',
  USER_PREFERENCES: 'userPreferences',
};

// UV Index thresholds
export const UV_INDEX = {
  LOW: 3,
  MODERATE: 7,
  COLORS: {
    LOW: '#10b981',
    MODERATE: '#f59e0b',
    HIGH: '#f97316',
  },
};
