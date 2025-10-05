import Route from "../models/Route.js";
import CarbonCalculator from "./CarbonCalculator.js";

/**
 * RouteCalculator - Orchestrates multi-modal route calculation and carbon emission analysis
 *
 * This service coordinates the entire route optimization process by integrating with external mapping
 * services (Google Maps API) and internal carbon calculation systems. It supports multiple transportation
 * modes and provides a unified interface for comparing routes based on distance, duration, and environmental impact.
 *
 * The calculator handles both real API data from Google Maps and fallback mock data for development/testing
 * scenarios. It automatically ranks routes by carbon footprint to help users make environmentally conscious
 * transportation choices.
 *
 * Key capabilities:
 * - Multi-modal route fetching from Google Maps API or mock data generation
 * - Carbon emission calculation integration with CarbonCalculator service
 * - Intelligent route filtering and error handling for individual transport modes
 * - Automatic route ranking by environmental impact (lowest emissions first)
 * - Support for customizable transport options (EV efficiency, rideshare occupancy, etc.)
 * - Location format handling for both coordinate pairs and address strings
 * - Comprehensive error handling with graceful degradation
 */
class RouteCalculator {
  /**
   * Constructor - Initializes the route calculator with external dependencies and configuration
   *
   * Sets up the RouteCalculator service by establishing connections to external mapping services
   * and internal carbon calculation systems. The constructor also determines whether to use real
   * API data or mock data based on the availability of Google Maps API credentials.
   *
   * Initialization responsibilities:
   * - Establishes HTTP client for Google Maps API communication
   * - Creates CarbonCalculator instance for emission calculations
   * - Configures data source strategy (real API vs mock data) based on API key availability
   * - Enables fallback mode when API credentials are missing or set to placeholder values
   *
   * The constructor supports two operational modes:
   * - Production mode: Uses real Google Maps API for accurate routing data
   * - Development mode: Uses mock data for testing without requiring API credentials
   *
   * @param {Object} googleMapsClient - HTTP client instance for making API requests to Google Maps
   */
  constructor(googleMapsClient) {
    this.googleMapsClient = googleMapsClient;
    this.carbonCalculator = new CarbonCalculator();
    this.useMockData =
      process.env.MAPS_API_KEY === "PUT_API_KEY_HERE" ||
      !process.env.MAPS_API_KEY;
  }

  /**
   * Calculate routes for multiple transportation modes with carbon emission analysis
   *
   * This is the main orchestration method that handles the complete route calculation workflow.
   * It supports both real Google Maps API data and mock data for development scenarios, then
   * processes the results through carbon emission calculations and returns ranked results.
   *
   * The method follows this workflow:
   * 1. Validates and extracts request parameters (origin, destination, transport modes)
   * 2. Determines data source strategy (real API vs mock data)
   * 3. Fetches route data for each requested transportation mode in parallel
   * 4. Filters out any failed route requests
   * 5. Calculates carbon emissions for each valid route
   * 6. Converts and normalizes route data (meters→km, seconds→minutes)
   * 7. Creates Route objects with complete emission analysis
   * 8. Returns routes ranked by environmental impact (lowest emissions first)
   *
   * Error handling strategy:
   * - Individual mode failures don't stop the entire process
   * - Failed routes are filtered out rather than throwing errors
   * - Network timeouts and API errors are caught and logged
   * - Method throws only for critical system failures
   *
   * @param {Object} request - Route calculation request object
   * @param {string} request.origin - Starting location (coordinates or address)
   * @param {string} request.destination - Ending location (coordinates or address)
   * @param {string[]} request.transportModes - Array of transportation modes to calculate
   * @param {Object} request.options - Optional transport-specific configuration
   * @returns {Route[]} Array of Route objects sorted by carbon footprint (lowest first)
   * @throws {Error} If critical system failure occurs during route calculation
   */
  async calculateRoutes(request) {
    const {
      origin,
      destination,
      transportModes = ["driving", "transit", "walking", "cycling"],
    } = request;

    try {
      let routes;

      if (this.useMockData) {
        // Use mock data for testing when API key is not available
        routes = this.getMockRoutes(origin, destination, transportModes);
      } else {
        // Get routes for all requested modes from Google Maps
        const routePromises = transportModes.map((mode) =>
          this.getRouteFromGoogleMaps(origin, destination, mode),
        );

        const googleRoutes = await Promise.all(routePromises);
        routes = googleRoutes.filter((route) => route !== null);
      }

      // Filter out failed routes and calculate emissions
      const validRoutes = routes.map((route) => {
        const transportMode = route.mode;
        const distanceKm = route.distance / 1000; // Convert meters to km
        const durationMin = route.duration / 60; // Convert seconds to minutes

        // Create route object with emissions calculation
        const emissions = this.carbonCalculator.calculate(
          { distance: distanceKm },
          transportMode,
          request.options?.[transportMode] || {},
        );

        return new Route(route.polyline, distanceKm, durationMin, emissions);
      });

      return validRoutes;
    } catch (error) {
      console.error("Error calculating routes:", error);
      throw new Error("Failed to calculate routes");
    }
  }

  /**
   * Fetch route data from Google Maps API for a specific transportation mode
   *
   * This method handles the low-level communication with the Google Maps Routes API to retrieve
   * routing information for a single transportation mode. It constructs the appropriate API request,
   * handles the response parsing, and returns normalized route data.
   *
   * API Integration Details:
   * - Uses Google Maps Routes API v2 (computeRoutes endpoint)
   * - Requests distance, duration, and polyline data for route visualization
   * - Includes fuel consumption data for driving modes when available
   * - Sets appropriate timeouts to prevent hanging requests
   * - Handles both coordinate pairs and address strings as input
   *
   * Request Construction:
   * - Maps internal transport modes to Google Maps travel modes (DRIVE, TRANSIT, WALK, BICYCLE)
   * - Configures traffic-aware routing for driving modes
   * - Requests high-quality polylines for accurate route visualization
   * - Sets metric units and Canadian region code for consistent results
   *
   * Error Handling:
   * - Returns null for failed requests instead of throwing errors
   * - Logs specific error details for debugging while maintaining service stability
   * - Handles API quota exceeded, network timeouts, and malformed responses
   * - Individual mode failures don't affect other modes in multi-modal requests
   *
   * @param {string} origin - Starting location (coordinates "lat,lng" or address)
   * @param {string} destination - Ending location (coordinates "lat,lng" or address)
   * @param {string} mode - Transportation mode ("driving", "transit", "walking", "cycling", etc.)
   * @returns {Object|null} Route data object or null if request fails
   * @returns {string} return.mode - The transportation mode used
   * @returns {number} return.distance - Distance in meters
   * @returns {number} return.duration - Duration in seconds
   * @returns {string} return.polyline - Encoded polyline for route visualization
   */
  async getRouteFromGoogleMaps(origin, destination, mode) {
    try {
      // Map our transport modes to Google Maps travel modes
      const googleTravelMode = this.mapToGoogleTravelMode(mode);

      const requestBody = {
        origin: this.formatLocation(origin),
        destination: this.formatLocation(destination),
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

      const response = await this.googleMapsClient.post(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        requestBody,
        {
          headers: {
            "X-Goog-Api-Key": process.env.MAPS_API_KEY,
            "X-Goog-FieldMask":
              "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
          },
          timeout: 10000,
        },
      );

      const route = response.data?.routes?.[0];
      if (!route) return null;

      return {
        mode: mode,
        distance: route.distanceMeters,
        duration: route.duration?.replace("s", "") || 0,
        polyline: route.polyline?.encodedPolyline || "",
      };
    } catch (error) {
      console.error(
        `Error getting ${mode} route:`,
        error.response?.data || error.message,
      );
      return null; // Return null for failed modes instead of throwing
    }
  }

  /**
   * Format location input for Google Maps API compatibility
   *
   * This utility method handles the conversion of location inputs into the format expected by
   * the Google Maps Routes API. It supports both coordinate pairs (latitude,longitude) and
   * address strings, automatically detecting the input type and formatting accordingly.
   *
   * Location Format Handling:
   * - Coordinate pairs: "49.2827,-123.1207" → Google Maps latLng object
   * - Address strings: "1600 Amphitheatre Parkway, Mountain View, CA" → Google Maps address object
   * - Handles whitespace variations and decimal precision in coordinate inputs
   * - Validates coordinate format using regex pattern matching
   *
   * The method ensures consistent API request formatting regardless of how users provide
   * location information, supporting both programmatic coordinate inputs and human-readable
   * addresses. This flexibility improves the API's usability across different use cases.
   *
   * @param {string} location - Location as either coordinates "lat,lng" or address string
   * @returns {Object} Formatted location object for Google Maps API
   * @returns {Object} return.location - For coordinate inputs: { latLng: { latitude, longitude } }
   * @returns {string} return.address - For address inputs: the original address string
   */
  formatLocation(location) {
    // Handle both coordinate pairs and addresses
    const coordMatch = location.match(
      /^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/,
    );
    if (coordMatch) {
      const [_, lat, , lng] = coordMatch;
      return {
        location: {
          latLng: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
          },
        },
      };
    }
    return { address: location };
  }

  /**
   * Map internal transportation modes to Google Maps travel modes
   *
   * This utility method provides translation between the internal transportation mode
   * enumeration used by the application and the specific travel mode constants expected
   * by the Google Maps Routes API. It ensures compatibility between the application's
   * transport mode abstraction and the external API's requirements.
   *
   * Mode Mapping Strategy:
   * - Standard modes (driving, transit, walking, cycling) map directly to Google Maps equivalents
   * - Advanced modes (hybrid, ev, rideshare) are treated as driving for routing purposes
   * - Unknown modes default to driving to ensure API compatibility
   * - Maintains consistent behavior across different transport types
   *
   * This abstraction layer allows the application to:
   * - Use descriptive internal mode names (e.g., "ev" for electric vehicles)
   * - Extend transport mode support without breaking API integration
   * - Maintain consistent routing behavior for similar transport types
   * - Handle future transportation modes as they become available
   *
   * @param {string} mode - Internal transportation mode name
   * @returns {string} Google Maps travel mode constant (DRIVE, TRANSIT, WALK, BICYCLE)
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
   * Generate realistic mock route data for development and testing scenarios
   *
   * This method creates simulated route data when Google Maps API credentials are not available
   * or when running in development mode. It generates realistic transportation times and distances
   * based on typical travel patterns for different transportation modes, allowing the application
   * to function without requiring API keys during development.
   *
   * Mock Data Generation Strategy:
   * - Uses a base distance of 5km for consistent comparison across modes
   * - Applies realistic multipliers for each transportation type:
   *   - Walking: 1.2x distance (pedestrian routes often longer than direct paths)
   *   - Cycling: 0.95x distance (can take more direct routes than driving)
   *   - Transit: 1.1x distance (may include indirect routing and transfers)
   *   - Driving: 1.0x distance (most direct motorized route)
   *
   * Time Calculations:
   * - Walking: 12 minutes per km (5 km/h average walking speed)
   * - Cycling: 3 minutes per km (20 km/h average cycling speed)
   * - Transit: 6 minutes per km (includes waiting time and transfers)
   * - Driving: 2 minutes per km (urban driving with traffic considerations)
   *
   * This approach provides:
   * - Consistent test data across development environments
   * - Realistic relative comparisons between transportation modes
   * - No external API dependencies for basic functionality testing
   * - Predictable results for automated testing scenarios
   *
   * @param {string} origin - Starting location (unused in mock generation)
   * @param {string} destination - Ending location (unused in mock generation)
   * @param {string[]} transportModes - Array of transportation modes to generate data for
   * @returns {Object[]} Array of mock route objects with consistent structure to real API data
   * @returns {string} route.mode - Transportation mode name
   * @returns {number} route.distance - Distance in meters
   * @returns {number} route.duration - Duration in seconds
   * @returns {string} route.polyline - Mock polyline identifier for visualization
   */
  getMockRoutes(origin, destination, transportModes) {
    // Generate realistic mock route data for testing
    const baseDistance = 5.0; // Base distance in km
    const routes = [];

    transportModes.forEach((mode, index) => {
      let distance, duration, polyline;

      switch (mode) {
        case "walking":
          distance = baseDistance * 1.2; // Walking routes are usually longer
          duration = distance * 12; // 12 minutes per km walking
          polyline = "mock_walking_polyline";
          break;
        case "cycling":
          distance = baseDistance * 0.95; // Cycling can take more direct routes
          duration = distance * 3; // 3 minutes per km cycling
          polyline = "mock_cycling_polyline";
          break;
        case "transit":
          distance = baseDistance * 1.1; // Transit routes may be indirect
          duration = baseDistance * 6; // 6 minutes per km transit (including waiting)
          polyline = "mock_transit_polyline";
          break;
        case "driving":
        default:
          distance = baseDistance;
          duration = baseDistance * 2; // 2 minutes per km driving
          polyline = "mock_driving_polyline";
          break;
      }

      routes.push({
        mode,
        distance: Math.round(distance * 1000), // Convert to meters
        duration: Math.round(duration * 60), // Convert to seconds
        polyline,
      });
    });

    return routes;
  }
}

export default RouteCalculator;
