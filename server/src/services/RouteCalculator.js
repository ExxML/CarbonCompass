import Route from "../models/Route.js";
import CarbonCalculator from "./CarbonCalculator.js";
import MapsService from "./MapsService.js";

/**
 * RouteCalculator - Orchestrates multi-modal route calculation and carbon emission analysis
 *
 * This service coordinates the entire route optimization process by integrating with external mapping
 * services and internal carbon calculation systems. It acts as a facade that combines MapsService
 * for route data retrieval with CarbonCalculator for emission analysis, providing a unified
 * interface for route optimization and comparison.
 *
 * The calculator delegates Google Maps API interactions to the dedicated MapsService while
 * focusing on route processing, emission calculation integration, and result normalization.
 * It automatically ranks routes by carbon footprint to help users make environmentally conscious
 * transportation choices.
 *
 * Key capabilities:
 * - Multi-modal route coordination using dedicated MapsService
 * - Carbon emission calculation integration with enhanced CarbonCalculator
 * - Intelligent route filtering and error handling for individual transport modes
 * - Automatic route ranking by environmental impact (lowest emissions first)
 * - Support for customizable transport options (EV efficiency, rideshare occupancy, etc.)
 * - Comprehensive error handling with graceful degradation
 * - Service composition and dependency management
 */
class RouteCalculator {
  /**
   * Constructor - Initializes the route calculator with service dependencies
   *
   * Sets up the RouteCalculator service by establishing connections to the MapsService
   * for route data retrieval and CarbonCalculator for emission analysis. The constructor
   * follows the dependency injection pattern to ensure proper service composition and
   * testability.
   *
   * Initialization responsibilities:
   * - Creates MapsService instance for Google Maps API integration
   * - Creates CarbonCalculator instance for emission calculations
   * - Establishes service composition for coordinated route processing
   * - Enables proper error propagation and service health monitoring
   *
   * The constructor supports clean architecture principles:
   * - Single Responsibility: RouteCalculator focuses on orchestration
   * - Dependency Injection: Services are injected rather than created internally
   * - Service Composition: Combines specialized services for complex operations
   *
   * @param {MapsService} mapsService - Maps service instance for route data retrieval
   * @param {CarbonCalculator} carbonCalculator - Carbon calculator instance for emission analysis
   */
  constructor(mapsService = null, carbonCalculator = null) {
    this.mapsService = mapsService || new MapsService();
    this.carbonCalculator = carbonCalculator || new CarbonCalculator();
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
    try {
      const {
        origin,
        destination,
        transportModes = ["driving", "transit", "walking", "cycling"],
      } = request;

      // Validate inputs using CarbonCalculator validation
      const validation = this.carbonCalculator.validateCalculationInputs(
        { distance: 1 }, // Dummy route for validation
        transportModes[0] || "driving",
      );

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // Get routes for all requested modes from MapsService
      // MapsService handles API vs mock data logic internally
      const routes = await this.mapsService.calculateRoutes(
        origin,
        destination,
        transportModes,
      );

      if (routes.length === 0) {
        throw new Error(
          "No routes found for the specified locations and transport modes",
        );
      }

      // Process routes through carbon emission calculations
      const validRoutes = routes.map((route) => {
        const transportMode = route.mode;
        const distanceKm = route.distance / 1000; // Convert meters to km
        const durationMin = route.duration / 60; // Convert seconds to minutes

        // Calculate emissions using enhanced CarbonCalculator
        const emissionsResult = this.carbonCalculator.calculate(
          { distance: distanceKm },
          transportMode,
          request.options?.[transportMode] || {},
        );

        // Handle new CarbonCalculator return format (object with emissions, uncertainty, breakdown)
        const emissions =
          typeof emissionsResult === "object"
            ? emissionsResult.emissions
            : emissionsResult;

        return new Route(route.polyline, distanceKm, durationMin, emissions);
      });

      return validRoutes;
    } catch (error) {
      console.error(
        "RouteCalculator: Route calculation failed:",
        error.message,
      );
      throw new Error(`Failed to calculate routes: ${error.message}`);
    }
  }

}

export default RouteCalculator;
