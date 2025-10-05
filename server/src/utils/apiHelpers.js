/**
 * API Helper Functions - Utility functions for API operations and data transformation
 *
 * This module provides a collection of utility functions that handle common API operations,
 * data transformations, and error handling patterns. These helpers ensure consistent behavior
 * across all API endpoints and reduce code duplication.
 *
 * Key utilities:
 * - HTTP response formatting and error handling
 * - Data validation and sanitization
 * - Location coordinate parsing and validation
 * - API response normalization
 * - Retry logic for external API calls
 * - Rate limiting helpers
 */

import config from "./config.js";

/**
 * Format successful API response with consistent structure
 *
 * This function ensures all API responses follow a consistent format with proper
 * status codes, data structure, and metadata. It handles both success and error responses.
 *
 * @param {Object} res - Express response object
 * @param {Object} data - Response data payload
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {Object} metadata - Optional metadata for the response
 */
export function sendSuccessResponse(
  res,
  data,
  statusCode = 200,
  metadata = {},
) {
  const response = {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      ...metadata,
    },
  };

  res.status(statusCode).json(response);
}

/**
 * Format error API response with consistent structure
 *
 * This function ensures all error responses follow a consistent format with proper
 * error codes, messages, and debugging information.
 *
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {string} errorCode - Optional error code for client handling
 * @param {Object} details - Optional additional error details
 */
export function sendErrorResponse(
  res,
  message,
  statusCode = 500,
  errorCode = null,
  details = {},
) {
  const response = {
    success: false,
    error: {
      message,
      code: errorCode || `ERROR_${statusCode}`,
      timestamp: new Date().toISOString(),
      ...details,
    },
  };

  res.status(statusCode).json(response);
}

/**
 * Validate and parse location coordinates or addresses
 *
 * This function handles the validation and parsing of location inputs, supporting
 * both coordinate pairs (lat,lng) and address strings. It ensures consistent
 * location handling across all API endpoints.
 *
 * @param {string} location - Location as coordinates "lat,lng" or address string
 * @returns {Object} Parsed location object
 * @throws {Error} If location format is invalid
 */
export function parseLocation(location) {
  if (!location || typeof location !== "string") {
    throw new Error("Location must be a non-empty string");
  }

  // Check if location is coordinate pair (lat,lng format)
  const coordinateRegex = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
  const coordinateMatch = location.match(coordinateRegex);

  if (coordinateMatch) {
    const lat = parseFloat(coordinateMatch[1]);
    const lng = parseFloat(coordinateMatch[2]);

    // Validate coordinate ranges
    if (lat < -90 || lat > 90) {
      throw new Error("Latitude must be between -90 and 90 degrees");
    }
    if (lng < -180 || lng > 180) {
      throw new Error("Longitude must be between -180 and 180 degrees");
    }

    return {
      type: "coordinates",
      coordinates: [lng, lat], // GeoJSON format [longitude, latitude]
      original: location,
      formatted: {
        location: {
          latLng: {
            latitude: lat,
            longitude: lng,
          },
        },
      },
    };
  }

  // Treat as address if not coordinates
  return {
    type: "address",
    address: location.trim(),
    original: location,
    formatted: {
      address: location.trim(),
    },
  };
}

/**
 * Validate transportation modes array
 *
 * This function validates that the provided transportation modes are supported
 * and returns a normalized array of valid modes.
 *
 * @param {string[]} modes - Array of transportation mode strings
 * @param {string[]} allowedModes - Array of allowed transportation modes
 * @returns {string[]} Normalized array of valid transportation modes
 * @throws {Error} If any mode is invalid or no valid modes provided
 */
export function validateTransportModes(
  modes,
  allowedModes = [
    "driving",
    "transit",
    "walking",
    "cycling",
    "hybrid",
    "ev",
    "rideshare",
  ],
) {
  if (!Array.isArray(modes) || modes.length === 0) {
    throw new Error("At least one transportation mode must be specified");
  }

  const validModes = modes.filter(
    (mode) =>
      typeof mode === "string" && allowedModes.includes(mode.toLowerCase()),
  );

  if (validModes.length === 0) {
    throw new Error(
      `No valid transportation modes provided. Allowed modes: ${allowedModes.join(", ")}`,
    );
  }

  // Return normalized modes (lowercase)
  return validModes.map((mode) => mode.toLowerCase());
}

/**
 * Retry function for API calls with exponential backoff
 *
 * This function implements retry logic with exponential backoff for handling
 * transient API failures. It's particularly useful for external API calls
 * that may experience temporary network issues.
 *
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} baseDelay - Base delay in milliseconds for exponential backoff
 * @param {Function} shouldRetry - Function to determine if error should trigger retry
 * @returns {Promise} Result of the function call
 */
export async function retryWithBackoff(
  fn,
  maxRetries = 3,
  baseDelay = 1000,
  shouldRetry = null,
) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Check if we should retry this error
      if (shouldRetry && !shouldRetry(error)) {
        throw error;
      }

      // Default retry logic: retry on network errors and 5xx status codes
      const shouldRetryDefault = (err) => {
        if (
          err.code === "ECONNRESET" ||
          err.code === "ETIMEDOUT" ||
          err.code === "ENOTFOUND"
        ) {
          return true;
        }
        if (err.response && err.response.status >= 500) {
          return true;
        }
        return false;
      };

      if (!shouldRetryDefault(error)) {
        throw error;
      }

      // Exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Sanitize and normalize API response data
 *
 * This function cleans and normalizes data received from external APIs,
 * ensuring consistent data types and removing potentially sensitive information.
 *
 * @param {Object} data - Raw API response data
 * @param {string[]} allowedFields - Array of fields to keep in the response
 * @returns {Object} Sanitized and normalized data
 */
export function sanitizeApiResponse(data, allowedFields = null) {
  if (!data || typeof data !== "object") {
    return {};
  }

  const sanitized = {};

  if (allowedFields) {
    // Only include allowed fields
    allowedFields.forEach((field) => {
      if (field in data) {
        sanitized[field] = data[field];
      }
    });
  } else {
    // Include all fields but sanitize recursively
    Object.keys(data).forEach((key) => {
      const value = data[key];

      if (typeof value === "string") {
        // Remove potential sensitive data patterns
        sanitized[key] = value.replace(
          /([A-Za-z0-9+/]{40,}={0,2})/g,
          "[REDACTED]",
        );
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeApiResponse(value);
      } else {
        sanitized[key] = value;
      }
    });
  }

  return sanitized;
}

/**
 * Calculate distance between two coordinate points using Haversine formula
 *
 * This utility function calculates the great-circle distance between two points
 * on Earth using their latitude and longitude coordinates. Useful for validating
 * API responses or providing fallback distance calculations.
 *
 * @param {number[]} point1 - First point as [longitude, latitude]
 * @param {number[]} point2 - Second point as [longitude, latitude]
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(point1, point2) {
  const [lon1, lat1] = point1;
  const [lon2, lat2] = point2;

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Validate request rate limits
 *
 * This function provides rate limiting validation logic that can be used
 * across different API endpoints to ensure fair usage.
 *
 * @param {string} identifier - Unique identifier for rate limiting (e.g., IP address, user ID)
 * @param {Object} options - Rate limiting options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.maxRequests - Maximum requests per window
 * @returns {boolean} True if request is within limits
 */
export function checkRateLimit(identifier, options = {}) {
  const { windowMs = 60000, maxRequests = 60 } = options;

  // In a real implementation, this would check against a rate limiting store
  // For now, we'll implement a simple in-memory check
  // TODO: Integrate with Redis or other distributed rate limiting solution

  return true; // Always allow for now - implement actual rate limiting later
}

/**
 * Format duration from seconds to human-readable string
 *
 * This utility function converts duration in seconds to a human-readable
 * format suitable for API responses and user interfaces.
 *
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export function formatDuration(seconds) {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

/**
 * Format distance from meters to human-readable string
 *
 * This utility function converts distance in meters to a human-readable
 * format with appropriate units for API responses.
 *
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance string
 */
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
}
