/**
 * MapsService - Google Maps API Integration Service
 *
 * This service provides a comprehensive interface for interacting with Google Maps APIs,
 * including the Routes API, Geocoding API, and Distance Matrix API. It handles authentication,
 * request formatting, error handling, and response normalization.
 *
 * Key responsibilities:
 * - Google Maps Routes API integration for route calculation
 * - Google Maps Geocoding API for address-to-coordinate conversion
 * - Google Maps Distance Matrix API for distance calculations
 * - Request/response normalization and error handling
 * - API rate limiting and retry logic integration
 * - Comprehensive logging for debugging and monitoring
 */

import axios from "axios";
import { getGoogleMapsConfig } from "../utils/config.js";
import {
  retryWithBackoff,
  parseLocation,
  sanitizeApiResponse,
} from "../utils/apiHelpers.js";

/**
 * Maps API Service Class
 *
 * Provides methods for interacting with various Google Maps APIs while handling
 * authentication, error recovery, and response normalization.
 */
class MapsService {
  /**
   * Constructor - Initialize Maps service with configuration
   *
   * Sets up the Maps service with Google Maps API configuration, HTTP client,
   * and error handling strategies. The service supports both production API
   * calls and mock data for development scenarios.
   */
  constructor() {
    this.config = getGoogleMapsConfig();
    this.httpClient = axios.create({
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Enable mock data mode if no API key is provided
    this.useMockData =
      !this.config.apiKey || this.config.apiKey === "PUT_API_KEY_HERE";
  }

  /**
   * Calculate routes using Google Maps Routes API
   *
   * This method fetches route information for multiple transportation modes between
   * an origin and destination. It handles the Google Maps Routes API v2 and returns
   * normalized route data suitable for carbon emission calculations.
   *
   * API Integration Details:
   * - Uses Routes API v2 computeRoutes endpoint
   * - Supports multiple transportation modes (DRIVE, TRANSIT, WALK, BICYCLE)
   * - Requests distance, duration, and polyline data
   * - Includes fuel consumption data for driving modes
   * - Handles both coordinate pairs and address inputs
   *
   * @param {string} origin - Starting location (coordinates or address)
   * @param {string} destination - Ending location (coordinates or address)
   * @param {string[]} modes - Array of transportation modes to calculate
   * @returns {Promise<Object[]>} Array of route objects or empty array if failed
   */
  async calculateRoutes(origin, destination, modes = ["driving"]) {
    try {
      if (this.useMockData) {
        return this.getMockRoutes(origin, destination, modes);
      }

      const routePromises = modes.map((mode) =>
        this.calculateSingleRoute(origin, destination, mode),
      );
      const routes = await Promise.allSettled(routePromises);

      // Filter successful results and normalize data
      return routes
        .filter((result) => result.status === "fulfilled" && result.value)
        .map((result) => result.value);
    } catch (error) {
      console.error("MapsService: Route calculation failed:", error.message);
      return [];
    }
  }

  /**
   * Calculate a single route for a specific transportation mode
   *
   * This method handles the low-level Google Maps Routes API call for a single
   * transportation mode, including request formatting and response processing.
   *
   * @param {string} origin - Starting location
   * @param {string} destination - Ending location
   * @param {string} mode - Transportation mode
   * @returns {Promise<Object|null>} Route object or null if failed
   */
  async calculateSingleRoute(origin, destination, mode) {
    try {
      const requestBody = this.buildRouteRequest(origin, destination, mode);

      const response = await retryWithBackoff(
        () =>
          this.httpClient.post(`${this.config.routesApiBaseUrl}`, requestBody, {
            headers: {
              "X-Goog-Api-Key": this.config.apiKey,
              "X-Goog-FieldMask": this.getFieldMask(mode),
            },
          }),
        this.config.retries,
        this.config.retryDelay,
      );

      const route = response.data?.routes?.[0];
      if (!route) {
        return null;
      }

      return this.normalizeRouteData(route, mode);
    } catch (error) {
      console.error(
        `MapsService: Failed to calculate ${mode} route:`,
        error.message,
      );
      return null;
    }
  }

  /**
   * Build Google Maps Routes API request body
   *
   * This method constructs the proper request format for the Google Maps Routes API
   * based on the provided origin, destination, and transportation mode.
   *
   * @param {string} origin - Starting location
   * @param {string} destination - Ending location
   * @param {string} mode - Transportation mode
   * @returns {Object} Formatted request body for Google Maps API
   */
  buildRouteRequest(origin, destination, mode) {
    const originLocation = parseLocation(origin);
    const destinationLocation = parseLocation(destination);
    const googleTravelMode = this.mapToGoogleTravelMode(mode);

    const requestBody = {
      origin: originLocation.formatted,
      destination: destinationLocation.formatted,
      travelMode: googleTravelMode,
      routingPreference: "TRAFFIC_AWARE",
      polylineQuality: "HIGH_QUALITY",
      languageCode: "en-US",
      units: "METRIC",
      regionCode: "CA",
    };

    // Add extra computations for driving modes
    if (mode === "driving" || mode === "hybrid") {
      requestBody.extraComputations = ["FUEL_CONSUMPTION"];
      requestBody.vehicleEmissionType = "GASOLINE";
    }

    return requestBody;
  }

  /**
   * Get appropriate field mask for Google Maps API request
   *
   * This method determines which fields to request from the Google Maps API
   * based on the transportation mode, optimizing response size and processing.
   *
   * @param {string} mode - Transportation mode
   * @returns {string} Field mask string for API request
   */
  getFieldMask(mode) {
    const baseFields =
      "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline";

    if (mode === "driving" || mode === "hybrid") {
      return `${baseFields},routes.travelAdvisory.fuelConsumptionMicroliters`;
    }

    return baseFields;
  }

  /**
   * Map internal transportation modes to Google Maps travel modes
   *
   * This utility method translates between the application's transportation mode
   * enumeration and Google Maps API travel mode constants.
   *
   * @param {string} mode - Internal transportation mode
   * @returns {string} Google Maps travel mode constant
   */
  mapToGoogleTravelMode(mode) {
    const modeMap = {
      driving: "DRIVE",
      transit: "TRANSIT",
      walking: "WALK",
      cycling: "BICYCLE",
      hybrid: "DRIVE", // Treat hybrid as drive for routing
      ev: "DRIVE", // Treat EV as drive for routing
      rideshare: "DRIVE", // Treat rideshare as drive for routing
    };

    return modeMap[mode] || "DRIVE";
  }

  /**
   * Normalize Google Maps API route response
   *
   * This method processes the raw Google Maps API response and converts it
   * into a normalized format suitable for the application's route processing.
   *
   * @param {Object} route - Raw route data from Google Maps API
   * @param {string} mode - Transportation mode used for the request
   * @returns {Object} Normalized route object
   */
  normalizeRouteData(route, mode) {
    const durationSeconds = this.parseDuration(route.duration);
    const distanceMeters = route.distanceMeters || 0;

    return {
      mode,
      distance: distanceMeters,
      duration: durationSeconds,
      polyline: route.polyline?.encodedPolyline || "",
      // Include additional data for driving modes
      ...((mode === "driving" || mode === "hybrid") && {
        fuelConsumptionLiters:
          (route.travelAdvisory?.fuelConsumptionMicroliters || 0) / 1_000_000,
      }),
    };
  }

  /**
   * Parse duration string from Google Maps API format
   *
   * This utility method converts Google Maps duration strings (e.g., "123s")
   * into numeric seconds for consistent processing.
   *
   * @param {string} duration - Duration string from Google Maps API
   * @returns {number} Duration in seconds
   */
  parseDuration(duration) {
    if (!duration || typeof duration !== "string") {
      return 0;
    }

    const match = duration.match(/^(\d+)s$/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Geocode address to coordinates using Google Maps Geocoding API
   *
   * This method converts human-readable addresses into geographic coordinates
   * using the Google Maps Geocoding API.
   *
   * @param {string} address - Address to geocode
   * @returns {Promise<Object|null>} Geocoding result or null if failed
   */
  async geocodeAddress(address) {
    try {
      if (this.useMockData) {
        return this.getMockGeocode(address);
      }

      const response = await retryWithBackoff(
        () =>
          this.httpClient.get(this.config.geocodingApiBaseUrl, {
            params: {
              address: address.trim(),
              key: this.config.apiKey,
            },
          }),
        this.config.retries,
        this.config.retryDelay,
      );

      const result = response.data?.results?.[0];
      if (!result) {
        return null;
      }

      return {
        formattedAddress: result.formatted_address,
        coordinates: [
          result.geometry.location.lng,
          result.geometry.location.lat,
        ],
        placeId: result.place_id,
      };
    } catch (error) {
      console.error("MapsService: Geocoding failed:", error.message);
      return null;
    }
  }

  /**
   * Calculate distance matrix using Google Maps Distance Matrix API
   *
   * This method calculates distances and travel times between multiple origin
   * and destination points using the Google Maps Distance Matrix API.
   *
   * @param {string[]} origins - Array of origin locations
   * @param {string[]} destinations - Array of destination locations
   * @param {string} mode - Transportation mode for calculations
   * @returns {Promise<Object|null>} Distance matrix data or null if failed
   */
  async calculateDistanceMatrix(origins, destinations, mode = "driving") {
    try {
      if (this.useMockData) {
        return this.getMockDistanceMatrix(origins, destinations, mode);
      }

      const response = await retryWithBackoff(
        () =>
          this.httpClient.get(this.config.distanceMatrixApiBaseUrl, {
            params: {
              origins: origins.join("|"),
              destinations: destinations.join("|"),
              mode: this.mapToGoogleTravelMode(mode).toLowerCase(),
              units: "metric",
              key: this.config.apiKey,
            },
          }),
        this.config.retries,
        this.config.retryDelay,
      );

      return sanitizeApiResponse(response.data);
    } catch (error) {
      console.error(
        "MapsService: Distance matrix calculation failed:",
        error.message,
      );
      return null;
    }
  }

  /**
   * Generate mock route data for development and testing
   *
   * This method creates realistic mock route data when Google Maps API
   * credentials are not available or for testing scenarios.
   *
   * @param {string} origin - Starting location (unused in mock)
   * @param {string} destination - Ending location (unused in mock)
   * @param {string[]} modes - Transportation modes to generate data for
   * @returns {Object[]} Array of mock route objects
   */
  getMockRoutes(origin, destination, modes) {
    const baseDistance = 5.0; // Base distance in km
    const routes = [];

    modes.forEach((mode) => {
      let distance, duration, polyline;

      switch (mode) {
        case "walking":
          distance = Math.round(baseDistance * 1.2 * 1000); // Convert to meters
          duration = Math.round((distance / 1000) * 12 * 60); // 12 min per km, convert to seconds
          polyline = "mock_walking_polyline_" + Date.now();
          break;
        case "cycling":
          distance = Math.round(baseDistance * 0.95 * 1000);
          duration = Math.round((distance / 1000) * 3 * 60); // 3 min per km
          polyline = "mock_cycling_polyline_" + Date.now();
          break;
        case "transit":
          distance = Math.round(baseDistance * 1.1 * 1000);
          duration = Math.round((distance / 1000) * 6 * 60); // 6 min per km including waiting
          polyline = "mock_transit_polyline_" + Date.now();
          break;
        case "driving":
        default:
          distance = Math.round(baseDistance * 1000);
          duration = Math.round((distance / 1000) * 2 * 60); // 2 min per km
          polyline = "mock_driving_polyline_" + Date.now();
          break;
      }

      routes.push({
        mode,
        distance,
        duration,
        polyline,
      });
    });

    return routes;
  }

  /**
   * Generate mock geocoding data for development
   *
   * @param {string} address - Address to geocode (unused in mock)
   * @returns {Object} Mock geocoding result
   */
  getMockGeocode(address) {
    return {
      formattedAddress: address,
      coordinates: [-123.1207, 49.2827], // Vancouver coordinates as example
      placeId: "mock_place_id_" + Date.now(),
    };
  }

  /**
   * Generate mock distance matrix data for development
   *
   * @param {string[]} origins - Origin locations (unused in mock)
   * @param {string[]} destinations - Destination locations (unused in mock)
   * @param {string} mode - Transportation mode (unused in mock)
   * @returns {Object} Mock distance matrix data
   */
  getMockDistanceMatrix(origins, destinations, mode) {
    const mockData = {
      status: "OK",
      origin_addresses: origins,
      destination_addresses: destinations,
      rows: origins.map(() => ({
        elements: destinations.map(() => ({
          status: "OK",
          duration: { value: 600 }, // 10 minutes in seconds
          distance: { value: 5000 }, // 5 km in meters
        })),
      })),
    };

    return mockData;
  }

  /**
   * Check if the service is in mock data mode
   *
   * This utility method allows other services to check if the Maps service
   * is operating in mock data mode for testing or development.
   *
   * @returns {boolean} True if using mock data, false if using real API
   */
  isMockMode() {
    return this.useMockData;
  }

  /**
   * Get service health and configuration status
   *
   * This method provides diagnostic information about the Maps service
   * configuration and operational status.
   *
   * @returns {Object} Service health and configuration information
   */
  getHealth() {
    return {
      service: "MapsService",
      mockMode: this.useMockData,
      apiKeyConfigured:
        !!this.config.apiKey && this.config.apiKey !== "PUT_API_KEY_HERE",
      timeout: this.config.timeout,
      retries: this.config.retries,
      apis: {
        routes: !this.useMockData,
        geocoding: !this.useMockData,
        distanceMatrix: !this.useMockData,
      },
    };
  }
}

export default MapsService;
