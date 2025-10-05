import { z } from "zod";

// Validation schemas
const directionsRequestSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  mode: z
    .enum(["driving", "walking", "bicycling", "transit"])
    .optional()
    .default("driving"),
  avoid: z
    .array(z.enum(["tolls", "highways", "ferries", "indoor"]))
    .optional()
    .default([]),
  units: z.enum(["metric", "imperial"]).optional().default("metric"),
  alternatives: z.boolean().optional().default(true),
  language: z.string().optional().default("en"),
  region: z.string().optional().default("us"),
});

/**
 * Middleware to validate directions request
 */
export const validateDirectionsRequest = (req, res, next) => {
  try {
    const validatedData = directionsRequestSchema.parse(req.body);
    req.validatedData = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    next(error);
  }
};

/**
 * Middleware to validate query parameters for GET requests
 */
export const validateDirectionsQuery = (req, res, next) => {
  try {
    const queryData = {
      origin: req.query.origin,
      destination: req.query.destination,
      mode: req.query.mode,
      avoid: req.query.avoid ? req.query.avoid.split(",") : undefined,
      units: req.query.units,
      alternatives: req.query.alternatives === "true",
      language: req.query.language,
      region: req.query.region,
    };

    // Remove undefined values
    Object.keys(queryData).forEach((key) => {
      if (queryData[key] === undefined) {
        delete queryData[key];
      }
    });

    const validatedData = directionsRequestSchema.parse(queryData);
    req.validatedData = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    next(error);
  }
};
