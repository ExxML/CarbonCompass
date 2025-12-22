import express from "express";
import GoogleMapsService from "../services/googleMaps.js";
import {
  validateDirectionsRequest,
  validateDirectionsQuery,
} from "../middleware/validation.js";
import { asyncHandler, GoogleMapsError } from "../utils/errors.js";

const router = express.Router();
let googleMapsService;

// Lazy initialization of Google Maps service
const getGoogleMapsService = () => {
  if (!googleMapsService) {
    googleMapsService = new GoogleMapsService();
  }
  return googleMapsService;
};

/**
 * POST /api/directions
 * Get directions between two points with request body
 */
router.post(
  "/",
  validateDirectionsRequest,
  asyncHandler(async (req, res) => {
    const { origin, destination, ...options } = req.validatedData;

    try {
      const service = getGoogleMapsService();
      const directionsData = await service.getDirections(
        origin,
        destination,
        options,
      );

      // Calculate carbon emissions for each route
      const routesWithEmissions = directionsData.routes.map((route) => {
        const distanceKm = route.distance.value / 1000; // Convert meters to km
        const emissions = service.calculateCarbonEmissions(
          distanceKm,
          options.mode,
        );

        return {
          ...route,
          carbon_emissions: emissions,
        };
      });

      res.json({
        success: true,
        data: {
          ...directionsData,
          routes: routesWithEmissions,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof GoogleMapsError) {
        console.error(
          "[Directions] Google Maps Error:",
          error.status,
          error.message,
        );
        return res.json({
          success: false,
          error: "Google Maps API Error",
          message: error.message,
          status: error.status,
          timestamp: new Date().toISOString(),
        });
      }
      console.error("[Directions] Unexpected error:", error.message);
      throw error;
    }
  }),
);

/**
 * GET /api/directions
 * Get directions between two points with query parameters
 */
router.get(
  "/",
  validateDirectionsQuery,
  asyncHandler(async (req, res) => {
    const { origin, destination, ...options } = req.validatedData;

    try {
      const service = getGoogleMapsService();
      const directionsData = await service.getDirections(
        origin,
        destination,
        options,
      );

      // Calculate carbon emissions for each route
      const routesWithEmissions = directionsData.routes.map((route) => {
        const distanceKm = route.distance.value / 1000; // Convert meters to km
        const emissions = service.calculateCarbonEmissions(
          distanceKm,
          options.mode,
        );

        return {
          ...route,
          carbon_emissions: emissions,
        };
      });

      res.json({
        success: true,
        data: {
          ...directionsData,
          routes: routesWithEmissions,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof GoogleMapsError) {
        console.error(
          "[Directions] Google Maps Error:",
          error.status,
          error.message,
        );
        return res.json({
          success: false,
          error: "Google Maps API Error",
          message: error.message,
          status: error.status,
          timestamp: new Date().toISOString(),
        });
      }
      console.error("[Directions] Unexpected error:", error.message);
      throw error;
    }
  }),
);

/**
 * POST /api/directions/carbon
 * Calculate carbon emissions for a specific route
 */
router.post(
  "/carbon",
  asyncHandler(async (req, res) => {
    const { distance, mode = "driving" } = req.body;

    if (!distance || typeof distance !== "number") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Distance (in km) is required and must be a number",
      });
    }

    const service = getGoogleMapsService();
    const emissions = service.calculateCarbonEmissions(distance, mode);

    res.json({
      success: true,
      data: emissions,
      timestamp: new Date().toISOString(),
    });
  }),
);

export default router;
