/**
 * Geolocation Service
 * Single Responsibility: Handle all geolocation-related operations
 */

import { API_CONFIG } from '../constants';

/**
 * Gets the user's current location using the browser's Geolocation API
 * @returns {Promise<{lat: number, lng: number, accuracy: number}>}
 * @throws {Error} When geolocation is not supported or permission is denied
 */
export const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    return Promise.reject(new Error('Geolocation is not supported by this browser'));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        resolve(location);
      },
      (error) => {
        let message = 'Location access failed';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: API_CONFIG.LOCATION_TIMEOUT,
        maximumAge: API_CONFIG.LOCATION_MAX_AGE,
      }
    );
  });
};

/**
 * Formats location coordinates into a user-friendly string
 * @param {{lat: number, lng: number}} location
 * @returns {string}
 */
export const formatLocationDisplay = (location) => {
  if (!location) return '';
  return `Current Location (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`;
};

/**
 * Formats location coordinates for API requests
 * @param {{lat: number, lng: number}} location
 * @returns {string}
 */
export const formatLocationForAPI = (location) => {
  if (!location) return '';
  return `${location.lat.toFixed(6)},${location.lng.toFixed(6)}`;
};

/**
 * Checks if geolocation is available in the current browser
 * @returns {boolean}
 */
export const isGeolocationAvailable = () => {
  return 'geolocation' in navigator;
};
