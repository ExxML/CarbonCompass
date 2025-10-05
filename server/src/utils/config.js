/**
 * Configuration Management - Centralized environment and application configuration
 *
 * This module provides a centralized configuration system that handles environment variables,
 * application settings, and validation. It ensures consistent configuration across all services
 * and provides sensible defaults for development and production environments.
 *
 * Key responsibilities:
 * - Environment variable validation and type conversion
 * - Default configuration values for development
 * - Configuration validation with helpful error messages
 * - Centralized configuration access for all services
 * - Support for different deployment environments
 */

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Application configuration object with validated environment variables
 *
 * This configuration object provides type-safe access to all application settings.
 * It includes validation to ensure required values are present and properly formatted.
 */
const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || "8080", 10),
    host: process.env.HOST || "0.0.0.0",
    environment: process.env.NODE_ENV || "development",
    corsOrigins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",")
      : ["http://localhost:5173", "http://127.0.0.1:5173"],
  },

  // Google Maps API configuration
  googleMaps: {
    apiKey: process.env.MAPS_API_KEY || "",
    routesApiBaseUrl:
      "https://routes.googleapis.com/directions/v2:computeRoutes",
    geocodingApiBaseUrl: "https://maps.googleapis.com/maps/api/geocode/json",
    distanceMatrixApiBaseUrl:
      "https://maps.googleapis.com/maps/api/distancematrix/json",
    timeout: parseInt(process.env.GOOGLE_MAPS_TIMEOUT || "10000", 10),
    retries: parseInt(process.env.GOOGLE_MAPS_RETRIES || "3", 10),
    retryDelay: parseInt(process.env.GOOGLE_MAPS_RETRY_DELAY || "1000", 10),
  },

  // Cache configuration
  cache: {
    ttl: parseInt(process.env.CACHE_TTL_SECONDS || "600", 10), // 10 minutes default
    maxSize: parseInt(process.env.CACHE_MAX_SIZE || "1000", 10),
    enabled: process.env.CACHE_ENABLED !== "false",
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10), // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || "60", 10),
    enabled: process.env.RATE_LIMIT_ENABLED !== "false",
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "combined",
    enableConsole: process.env.LOG_ENABLE_CONSOLE !== "false",
    enableFile: process.env.LOG_ENABLE_FILE === "true",
  },

  // Feature flags
  features: {
    enableMockData: process.env.ENABLE_MOCK_DATA === "true",
    enableCaching: process.env.ENABLE_CACHING !== "false",
    enableAnalytics: process.env.ENABLE_ANALYTICS === "true",
    enableUserPreferences: process.env.ENABLE_USER_PREFERENCES !== "false",
  },
};

/**
 * Validate configuration and ensure required values are present
 *
 * This function performs comprehensive validation of the configuration object,
 * checking for required values and ensuring proper types. It provides helpful
 * error messages for missing or invalid configuration.
 *
 * @throws {Error} If required configuration is missing or invalid
 */
function validateConfig() {
  const errors = [];

  // Validate server configuration
  if (
    isNaN(config.server.port) ||
    config.server.port < 1 ||
    config.server.port > 65535
  ) {
    errors.push("Invalid PORT: must be a number between 1 and 65535");
  }

  if (
    !Array.isArray(config.server.corsOrigins) ||
    config.server.corsOrigins.length === 0
  ) {
    errors.push(
      "Invalid CORS_ORIGINS: must be a comma-separated list of origins",
    );
  }

  // Validate Google Maps configuration
  if (!config.googleMaps.apiKey && !config.features.enableMockData) {
    errors.push("MAPS_API_KEY is required when ENABLE_MOCK_DATA is false");
  }

  if (config.googleMaps.timeout < 1000) {
    errors.push("GOOGLE_MAPS_TIMEOUT must be at least 1000ms");
  }

  if (config.googleMaps.retries < 0) {
    errors.push("GOOGLE_MAPS_RETRIES must be 0 or greater");
  }

  // Validate cache configuration
  if (config.cache.ttl < 0) {
    errors.push("CACHE_TTL_SECONDS must be 0 or greater");
  }

  if (config.cache.maxSize < 1) {
    errors.push("CACHE_MAX_SIZE must be at least 1");
  }

  // Validate rate limiting configuration
  if (config.rateLimit.windowMs < 1000) {
    errors.push("RATE_LIMIT_WINDOW_MS must be at least 1000ms");
  }

  if (config.rateLimit.maxRequests < 1) {
    errors.push("RATE_LIMIT_MAX must be at least 1");
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join("\n")}`);
  }
}

/**
 * Get configuration value with optional validation
 *
 * This utility function provides a safe way to access configuration values
 * with built-in validation and error handling.
 *
 * @param {string} path - Dot-notation path to configuration value (e.g., 'server.port')
 * @param {*} defaultValue - Default value if configuration is not found
 * @param {Function} validator - Optional validation function
 * @returns {*} Configuration value or default
 */
function getConfig(path, defaultValue = undefined, validator = null) {
  const keys = path.split(".");
  let value = config;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  if (validator && value !== undefined) {
    try {
      return validator(value);
    } catch (error) {
      console.warn(
        `Configuration validation failed for ${path}:`,
        error.message,
      );
      return defaultValue;
    }
  }

  return value;
}

/**
 * Check if a feature flag is enabled
 *
 * This utility function provides an easy way to check if specific features
 * are enabled in the current configuration.
 *
 * @param {string} feature - Feature flag name
 * @returns {boolean} True if feature is enabled
 */
function isFeatureEnabled(feature) {
  return getConfig(`features.${feature}`, false);
}

/**
 * Get server configuration for Express app setup
 *
 * This utility function returns server-specific configuration that's commonly
 * needed when setting up the Express application.
 *
 * @returns {Object} Server configuration object
 */
function getServerConfig() {
  return {
    port: config.server.port,
    host: config.server.host,
    corsOrigins: config.server.corsOrigins,
    environment: config.server.environment,
  };
}

/**
 * Get Google Maps API configuration
 *
 * This utility function returns Google Maps API configuration with all
 * necessary settings for making API requests.
 *
 * @returns {Object} Google Maps API configuration
 */
function getGoogleMapsConfig() {
  return {
    apiKey: config.googleMaps.apiKey,
    routesApiBaseUrl: config.googleMaps.routesApiBaseUrl,
    geocodingApiBaseUrl: config.googleMaps.geocodingApiBaseUrl,
    distanceMatrixApiBaseUrl: config.googleMaps.distanceMatrixApiBaseUrl,
    timeout: config.googleMaps.timeout,
    retries: config.googleMaps.retries,
    retryDelay: config.googleMaps.retryDelay,
  };
}

// Validate configuration on module load
validateConfig();

export {
  config,
  getConfig,
  isFeatureEnabled,
  getServerConfig,
  getGoogleMapsConfig,
  validateConfig,
};

export default config;
