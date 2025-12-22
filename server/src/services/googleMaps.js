import axios from "axios";
import { GoogleMapsError } from "../utils/errors.js";

class GoogleMapsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = "https://maps.googleapis.com/maps/api";

    console.log(
      "[GoogleMapsService] Initializing with API key:",
      this.apiKey ? "Present" : "MISSING",
    );

    if (!this.apiKey) {
      throw new Error("Google Maps API key is required");
    }
  }

  /**
   * Get directions between two points
   * @param {string} origin - Starting point (address, lat/lng, place ID)
   * @param {string} destination - Ending point (address, lat/lng, place ID)
   * @param {Object} options - Additional options for the request
   * @returns {Promise<Object>} - Directions response from Google Maps API
   */
  async getDirections(origin, destination, options = {}) {
    try {
      const {
        mode = "driving", // driving, walking, bicycling, transit
        avoid = [], // tolls, highways, ferries, indoor
        units = "metric", // metric, imperial
        alternatives = true,
        language = "en",
        region = "us",
      } = options;

      const params = {
        origin,
        destination,
        mode,
        units,
        alternatives,
        language,
        region,
        key: this.apiKey,
      };

      // Add avoid parameter if specified
      if (avoid.length > 0) {
        params.avoid = avoid.join("|");
      }

      const response = await axios.get(`${this.baseUrl}/directions/json`, {
        params,
        timeout: 10000, // 10 second timeout
      });

      if (response.data.status !== "OK") {
        throw new GoogleMapsError(
          `${response.data.status}: ${response.data.error_message || "There was an issue performing a Directions request."}`,
          response.data.status,
        );
      }

      return this.processDirectionsResponse(response.data);
    } catch (error) {
      if (error instanceof GoogleMapsError) {
        throw error;
      }
      if (error.response) {
        throw new GoogleMapsError(
          `API request failed: ${error.response.status} ${error.response.statusText}`,
          "REQUEST_FAILED",
        );
      }
      throw new GoogleMapsError(
        error.message || "Unknown error occurred",
        "UNKNOWN_ERROR",
      );
    }
  }

  /**
   * Process and format the directions response
   * @param {Object} data - Raw response from Google Maps API
   * @returns {Object} - Processed response
   */
  processDirectionsResponse(data) {
    const routes = data.routes.map((route) => {
      const leg = route.legs[0]; // Assuming single leg for now

      return {
        summary: route.summary,
        distance: {
          text: leg.distance.text,
          value: leg.distance.value, // in meters
        },
        duration: {
          text: leg.duration.text,
          value: leg.duration.value, // in seconds
        },
        start_address: leg.start_address,
        end_address: leg.end_address,
        start_location: leg.start_location,
        end_location: leg.end_location,
        polyline: route.overview_polyline.points,
        steps: leg.steps.map((step) => {
          const baseStep = {
            distance: step.distance,
            duration: step.duration,
            instructions: step.html_instructions,
            polyline: step.polyline.points,
            travel_mode: step.travel_mode,
            start_location: step.start_location,
            end_location: step.end_location,
          };

          // Add transit-specific details if this is a transit step
          if (step.travel_mode === "TRANSIT" && step.transit_details) {
            return {
              ...baseStep,
              transit_details: {
                departure_stop: {
                  name: step.transit_details.departure_stop.name,
                  location: step.transit_details.departure_stop.location,
                },
                arrival_stop: {
                  name: step.transit_details.arrival_stop.name,
                  location: step.transit_details.arrival_stop.location,
                },
                transit_line: {
                  name:
                    step.transit_details.line.short_name ||
                    step.transit_details.line.name,
                  vehicle: step.transit_details.line.vehicle.name,
                  color: step.transit_details.line.color,
                  agencies: step.transit_details.line.agencies,
                },
                departure_time: step.transit_details.departure_time?.text,
                arrival_time: step.transit_details.arrival_time?.text,
                num_stops: step.transit_details.num_stops,
              },
            };
          }

          return baseStep;
        }),
        warnings: route.warnings || [],
        waypoint_order: route.waypoint_order || [],
      };
    });

    return {
      status: data.status,
      routes,
      geocoded_waypoints: data.geocoded_waypoints,
    };
  }

  /**
   * Calculate carbon emissions based on distance and travel mode
   * @param {number} distanceKm - Distance in kilometers
   * @param {string} mode - Travel mode (driving, walking, bicycling, transit)
   * @returns {Object} - Carbon emission data
   */
  calculateCarbonEmissions(distanceKm, mode) {
    // Carbon emission factors (kg CO2 per km) - More realistic values
    const emissionFactors = {
      driving: 0.21, // Average car (typical passenger vehicle)
      walking: 0, // No emissions
      bicycling: 0, // No emissions
      transit: 0.089, // Average public transport (bus/train mix)
    };

    // Normalize the mode name and handle variations
    const normalizedMode = mode?.toLowerCase()?.trim();
    let factor;

    switch (normalizedMode) {
      case "driving":
        factor = emissionFactors.driving;
        break;
      case "walking":
        factor = emissionFactors.walking;
        break;
      case "bicycling":
      case "cycling":
      case "biking":
        factor = emissionFactors.bicycling;
        break;
      case "transit":
      case "public_transport":
        factor = emissionFactors.transit;
        break;
      default:
        console.warn(`Unknown travel mode: "${mode}", using driving factor`);
        factor = emissionFactors.driving;
    }

    const emissions = distanceKm * factor;

    return {
      emissions_kg: parseFloat(emissions.toFixed(1)),
      emissions_factor: factor,
      travel_mode: mode,
      distance_km: distanceKm,
    };
  }
}

export default GoogleMapsService;
