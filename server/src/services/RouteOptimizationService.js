/**
 * RouteOptimizationService - Smart Route Logic and Multi-Modal Optimization
 *
 * This service provides intelligent route optimization algorithms that go beyond simple
 * route calculation. It implements advanced logic for combining multiple transportation
 * modes, applying user preferences, and optimizing routes based on various criteria
 * including carbon emissions, time, cost, and user preferences.
 *
 * Key capabilities:
 * - Multi-modal route optimization (combining different transport modes)
 * - User preference application and weighting
 * - Route ranking and scoring based on multiple criteria
 * - Mixed-mode journey planning (e.g., bike + transit)
 * - Intelligent route filtering and selection
 * - Carbon emission optimization algorithms
 */

import Route from "../models/Route.js";
import CarbonCalculator from "./CarbonCalculator.js";
import MapsService from "./MapsService.js";
import {
  validateTransportModes,
  calculateDistance,
} from "../utils/apiHelpers.js";

/**
 * Route Optimization Service Class
 *
 * Orchestrates complex route optimization logic including multi-modal routing,
 * user preference application, and intelligent route ranking.
 */
class RouteOptimizationService {
  /**
   * Constructor - Initialize optimization service with dependencies
   *
   * Sets up the optimization service with required dependencies for route
   * calculation, carbon emission analysis, and mapping services.
   */
  constructor() {
    this.carbonCalculator = new CarbonCalculator();
    this.mapsService = new MapsService();
  }

  /**
   * Optimize routes based on origin, destination, and user preferences
   *
   * This is the main optimization method that handles route calculation,
   * carbon emission analysis, and intelligent ranking based on user preferences
   * and optimization criteria.
   *
   * @param {Object} request - Route optimization request
   * @param {string} request.origin - Starting location
   * @param {string} request.destination - Ending location
   * @param {string[]} request.transportModes - Transportation modes to consider
   * @param {Object} request.userPreferences - User preference settings
   * @param {string} request.optimizationStrategy - Optimization strategy to use
   * @returns {Promise<Object>} Optimized route results with rankings
   */
  async optimizeRoutes(request) {
    try {
      const {
        origin,
        destination,
        transportModes = ["driving", "transit", "walking", "cycling"],
        userPreferences = {},
        optimizationStrategy = "carbon_optimized",
      } = request;

      // Validate transportation modes
      const validModes = validateTransportModes(transportModes);

      // Get routes for all requested modes
      const rawRoutes = await this.mapsService.calculateRoutes(
        origin,
        destination,
        validModes,
      );

      if (rawRoutes.length === 0) {
        throw new Error("No routes found for the specified locations");
      }

      // Convert raw route data to Route objects with emission calculations
      const routes = rawRoutes.map((routeData) => {
        const distanceKm = routeData.distance / 1000;
        const durationMin = routeData.duration / 60;

        // Calculate carbon emissions
        const emissions = this.carbonCalculator.calculate(
          { distance: distanceKm },
          routeData.mode,
          userPreferences.transportOptions?.[routeData.mode] || {},
        );

        return new Route(
          routeData.polyline,
          distanceKm,
          durationMin,
          emissions,
        );
      });

      // Apply optimization strategy
      const optimizedRoutes = this.applyOptimizationStrategy(
        routes,
        optimizationStrategy,
        userPreferences,
      );

      // Generate optimization metadata
      const metadata = this.generateOptimizationMetadata(
        optimizedRoutes,
        optimizationStrategy,
      );

      return {
        origin,
        destination,
        results: optimizedRoutes,
        metadata,
        optimizationStrategy,
        totalRoutes: routes.length,
        requestId: this.generateRequestId(),
      };
    } catch (error) {
      console.error(
        "RouteOptimizationService: Optimization failed:",
        error.message,
      );
      throw error;
    }
  }

  /**
   * Apply optimization strategy to rank and filter routes
   *
   * This method implements different optimization strategies to rank routes
   * based on various criteria such as carbon emissions, time, distance, or
   * user preferences.
   *
   * @param {Route[]} routes - Array of Route objects to optimize
   * @param {string} strategy - Optimization strategy name
   * @param {Object} userPreferences - User preference settings
   * @returns {Route[]} Optimized and ranked array of routes
   */
  applyOptimizationStrategy(routes, strategy, userPreferences) {
    let optimizedRoutes;

    switch (strategy) {
      case "carbon_optimized":
        optimizedRoutes = this.optimizeForCarbonEmissions(
          routes,
          userPreferences,
        );
        break;
      case "time_optimized":
        optimizedRoutes = this.optimizeForTime(routes, userPreferences);
        break;
      case "balanced":
        optimizedRoutes = this.optimizeForBalance(routes, userPreferences);
        break;
      case "user_preference":
        optimizedRoutes = this.optimizeForUserPreferences(
          routes,
          userPreferences,
        );
        break;
      default:
        // Default to carbon optimization
        optimizedRoutes = this.optimizeForCarbonEmissions(
          routes,
          userPreferences,
        );
    }

    return optimizedRoutes;
  }

  /**
   * Optimize routes for minimum carbon emissions
   *
   * This strategy ranks routes primarily by their carbon footprint,
   * with secondary consideration for time efficiency.
   *
   * @param {Route[]} routes - Routes to optimize
   * @param {Object} userPreferences - User preferences for weighting
   * @returns {Route[]} Routes ranked by carbon emissions
   */
  optimizeForCarbonEmissions(routes, userPreferences) {
    return routes
      .map((route) => {
        // Calculate composite score (lower is better)
        const carbonWeight = 0.8;
        const timeWeight = 0.2;

        const maxEmissions = Math.max(...routes.map((r) => r.carbonFootprint));
        const maxTime = Math.max(...routes.map((r) => r.duration));

        const normalizedEmissions = route.carbonFootprint / maxEmissions;
        const normalizedTime = route.duration / maxTime;

        const score =
          normalizedEmissions * carbonWeight + normalizedTime * timeWeight;

        return { route, score };
      })
      .sort((a, b) => a.score - b.score)
      .map((item) => item.route);
  }

  /**
   * Optimize routes for minimum travel time
   *
   * This strategy ranks routes primarily by travel time,
   * with secondary consideration for carbon emissions.
   *
   * @param {Route[]} routes - Routes to optimize
   * @param {Object} userPreferences - User preferences for weighting
   * @returns {Route[]} Routes ranked by travel time
   */
  optimizeForTime(routes, userPreferences) {
    return routes
      .map((route) => {
        const timeWeight = 0.8;
        const carbonWeight = 0.2;

        const maxTime = Math.max(...routes.map((r) => r.duration));
        const maxEmissions = Math.max(...routes.map((r) => r.carbonFootprint));

        const normalizedTime = route.duration / maxTime;
        const normalizedEmissions = route.carbonFootprint / maxEmissions;

        const score =
          normalizedTime * timeWeight + normalizedEmissions * carbonWeight;

        return { route, score };
      })
      .sort((a, b) => a.score - b.score)
      .map((item) => item.route);
  }

  /**
   * Optimize routes for balanced criteria
   *
   * This strategy provides a balanced optimization considering
   * carbon emissions, time, and distance equally.
   *
   * @param {Route[]} routes - Routes to optimize
   * @param {Object} userPreferences - User preferences for weighting
   * @returns {Route[]} Routes ranked by balanced criteria
   */
  optimizeForBalance(routes, userPreferences) {
    return routes
      .map((route) => {
        const timeWeight = 0.4;
        const carbonWeight = 0.4;
        const distanceWeight = 0.2;

        const maxTime = Math.max(...routes.map((r) => r.duration));
        const maxEmissions = Math.max(...routes.map((r) => r.carbonFootprint));
        const maxDistance = Math.max(...routes.map((r) => r.distance));

        const normalizedTime = route.duration / maxTime;
        const normalizedEmissions = route.carbonFootprint / maxEmissions;
        const normalizedDistance = route.distance / maxDistance;

        const score =
          normalizedTime * timeWeight +
          normalizedEmissions * carbonWeight +
          normalizedDistance * distanceWeight;

        return { route, score };
      })
      .sort((a, b) => a.score - b.score)
      .map((item) => item.route);
  }

  /**
   * Optimize routes based on user preferences
   *
   * This strategy applies user-specific preferences and weightings
   * to rank routes according to individual user priorities.
   *
   * @param {Route[]} routes - Routes to optimize
   * @param {Object} userPreferences - Detailed user preference settings
   * @returns {Route[]} Routes ranked by user preferences
   */
  optimizeForUserPreferences(routes, userPreferences) {
    const preferences = userPreferences || {};

    // Extract preference weightings
    const carbonWeight = preferences.carbonWeight || 0.5;
    const timeWeight = preferences.timeWeight || 0.3;
    const distanceWeight = preferences.distanceWeight || 0.2;

    // Apply preferred transportation mode bonuses
    const preferredModes = preferences.preferredModes || [];

    return routes
      .map((route) => {
        let score = 0;

        // Normalize metrics
        const maxEmissions = Math.max(...routes.map((r) => r.carbonFootprint));
        const maxTime = Math.max(...routes.map((r) => r.duration));
        const maxDistance = Math.max(...routes.map((r) => r.distance));

        const normalizedEmissions = route.carbonFootprint / maxEmissions;
        const normalizedTime = route.duration / maxTime;
        const normalizedDistance = route.distance / maxDistance;

        // Calculate weighted score
        score += normalizedEmissions * carbonWeight;
        score += normalizedTime * timeWeight;
        score += normalizedDistance * distanceWeight;

        // Apply preferred mode bonus
        if (preferredModes.includes(route.mode)) {
          score *= 0.9; // 10% bonus for preferred modes
        }

        return { route, score };
      })
      .sort((a, b) => a.score - b.score)
      .map((item) => item.route);
  }

  /**
   * Generate mixed-mode routes (combining different transportation types)
   *
   * This advanced method creates route combinations that use different
   * transportation modes for different segments of a journey.
   *
   * @param {Object} request - Mixed-mode route request
   * @returns {Promise<Object>} Mixed-mode route results
   */
  async generateMixedModeRoutes(request) {
    const { origin, destination, modeCombinations = [] } = request;

    if (modeCombinations.length === 0) {
      // Generate default combinations
      modeCombinations.push(
        ["walking", "transit"],
        ["cycling", "transit"],
        ["driving", "transit"],
      );
    }

    const mixedRoutes = [];

    for (const combination of modeCombinations) {
      try {
        // Calculate route for each mode in the combination
        const segmentRoutes = await this.mapsService.calculateRoutes(
          origin,
          destination,
          combination,
        );

        if (segmentRoutes.length >= 2) {
          // Combine routes (simplified - in reality would need more complex logic)
          const primaryRoute = segmentRoutes[0];
          const secondaryRoute = segmentRoutes[1];

          mixedRoutes.push({
            type: "mixed_mode",
            primaryMode: primaryRoute.mode,
            secondaryMode: secondaryRoute.mode,
            totalDistance: primaryRoute.distance + secondaryRoute.distance,
            totalDuration: primaryRoute.duration + secondaryRoute.duration,
            totalEmissions:
              primaryRoute.carbonFootprint + secondaryRoute.carbonFootprint,
            segments: [primaryRoute, secondaryRoute],
          });
        }
      } catch (error) {
        console.error(
          `Failed to generate mixed route for ${combination.join("+")}:`,
          error.message,
        );
      }
    }

    return mixedRoutes;
  }

  /**
   * Apply user preferences to route filtering and ranking
   *
   * This method modifies route results based on user preferences such as
   * preferred transportation modes, maximum travel time, or emission limits.
   *
   * @param {Route[]} routes - Routes to filter and rank
   * @param {Object} preferences - User preference settings
   * @returns {Route[]} Filtered and ranked routes based on preferences
   */
  applyUserPreferences(routes, preferences) {
    let filteredRoutes = [...routes];

    // Filter by maximum duration if specified
    if (preferences.maxDurationMinutes) {
      filteredRoutes = filteredRoutes.filter(
        (route) => route.duration <= preferences.maxDurationMinutes,
      );
    }

    // Filter by maximum emissions if specified
    if (preferences.maxEmissionsGrams) {
      filteredRoutes = filteredRoutes.filter(
        (route) => route.carbonFootprint <= preferences.maxEmissionsGrams,
      );
    }

    // Filter by preferred modes if specified
    if (preferences.preferredModes && preferences.preferredModes.length > 0) {
      filteredRoutes = filteredRoutes.filter((route) =>
        preferences.preferredModes.includes(route.mode),
      );
    }

    // Filter out modes if specified
    if (preferences.excludedModes && preferences.excludedModes.length > 0) {
      filteredRoutes = filteredRoutes.filter(
        (route) => !preferences.excludedModes.includes(route.mode),
      );
    }

    return filteredRoutes;
  }

  /**
   * Generate optimization metadata for the response
   *
   * This method creates comprehensive metadata about the optimization
   * process including statistics, recommendations, and insights.
   *
   * @param {Route[]} routes - Optimized routes
   * @param {string} strategy - Optimization strategy used
   * @returns {Object} Optimization metadata
   */
  generateOptimizationMetadata(routes, strategy) {
    if (routes.length === 0) {
      return { message: "No routes available for optimization" };
    }

    const emissions = routes.map((r) => r.carbonFootprint);
    const durations = routes.map((r) => r.duration);
    const distances = routes.map((r) => r.distance);

    const bestRoute = routes[0];
    const worstRoute = routes[routes.length - 1];

    return {
      totalRoutesAnalyzed: routes.length,
      optimizationStrategy: strategy,
      emissionsRange: {
        min: Math.min(...emissions),
        max: Math.max(...emissions),
        average: Math.round(
          emissions.reduce((a, b) => a + b, 0) / emissions.length,
        ),
      },
      durationRange: {
        min: Math.min(...durations),
        max: Math.max(...durations),
        average: Math.round(
          durations.reduce((a, b) => a + b, 0) / durations.length,
        ),
      },
      distanceRange: {
        min: Math.min(...distances),
        max: Math.max(...distances),
        average:
          Math.round(
            (distances.reduce((a, b) => a + b, 0) / distances.length) * 100,
          ) / 100,
      },
      recommendations: this.generateRecommendations(
        bestRoute,
        worstRoute,
        routes,
      ),
      carbonSavings: this.calculateCarbonSavings(routes),
      modeDistribution: this.calculateModeDistribution(routes),
    };
  }

  /**
   * Generate personalized recommendations based on route analysis
   *
   * @param {Route} bestRoute - Most optimal route
   * @param {Route} worstRoute - Least optimal route
   * @param {Route[]} allRoutes - All available routes
   * @returns {string[]} Array of recommendation messages
   */
  generateRecommendations(bestRoute, worstRoute, allRoutes) {
    const recommendations = [];

    if (bestRoute.mode !== worstRoute.mode) {
      const savings = worstRoute.carbonFootprint - bestRoute.carbonFootprint;
      recommendations.push(
        `Switching from ${worstRoute.mode} to ${bestRoute.mode} would save ${savings}g of CO₂ emissions.`,
      );
    }

    // Check for significant time differences
    const timeDiff = worstRoute.duration - bestRoute.duration;
    if (timeDiff > 10) {
      recommendations.push(
        `The fastest option is ${Math.round(timeDiff)} minutes quicker than the slowest option.`,
      );
    }

    // Recommend based on user's apparent priorities
    const ecoFriendlyRoutes = allRoutes.filter((r) => r.carbonFootprint < 100);
    if (ecoFriendlyRoutes.length > 0) {
      recommendations.push(
        `${ecoFriendlyRoutes.length} eco-friendly options are available with under 100g CO₂ emissions.`,
      );
    }

    return recommendations;
  }

  /**
   * Calculate potential carbon savings across all routes
   *
   * @param {Route[]} routes - All available routes
   * @returns {Object} Carbon savings analysis
   */
  calculateCarbonSavings(routes) {
    if (routes.length < 2) {
      return { potentialSavings: 0, savingsPercentage: 0 };
    }

    const maxEmissions = Math.max(...routes.map((r) => r.carbonFootprint));
    const minEmissions = Math.min(...routes.map((r) => r.carbonFootprint));
    const savings = maxEmissions - minEmissions;
    const savingsPercentage = Math.round((savings / maxEmissions) * 100);

    return {
      potentialSavings: savings,
      savingsPercentage,
      maxEmissions,
      minEmissions,
    };
  }

  /**
   * Calculate distribution of transportation modes in results
   *
   * @param {Route[]} routes - Routes to analyze
   * @returns {Object} Mode distribution statistics
   */
  calculateModeDistribution(routes) {
    const distribution = {};

    routes.forEach((route) => {
      distribution[route.mode] = (distribution[route.mode] || 0) + 1;
    });

    return distribution;
  }

  /**
   * Generate unique request ID for tracking and caching
   *
   * @returns {string} Unique request identifier
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get optimization service health and capabilities
   *
   * This method provides diagnostic information about the optimization
   * service and its current configuration.
   *
   * @returns {Object} Service health and capability information
   */
  getHealth() {
    return {
      service: "RouteOptimizationService",
      carbonCalculator: this.carbonCalculator.getEmissionFactor
        ? "enhanced"
        : "basic",
      mapsService: "api_mode",
      supportedStrategies: [
        "carbon_optimized",
        "time_optimized",
        "balanced",
        "user_preference",
      ],
      supportedModes: [
        "driving",
        "transit",
        "walking",
        "cycling",
        "hybrid",
        "ev",
        "rideshare",
      ],
      features: {
        mixedModeRoutes: true,
        userPreferences: true,
        carbonOptimization: true,
        timeOptimization: true,
        balancedOptimization: true,
      },
    };
  }
}

export default RouteOptimizationService;
