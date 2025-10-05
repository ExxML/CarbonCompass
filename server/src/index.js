import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { z } from "zod";
import RouteCalculator from "./services/RouteCalculator.js";
import RequestController from "./controllers/RequestController.js";
import { getGoogleMapsConfig, getServerConfig } from "./utils/config.js";

dotenv.config();
const googleMapsConfig = getGoogleMapsConfig();
const serverConfig = getServerConfig();

console.log("Google Maps API Key:", process.env.MAPS_API_KEY ? "YES" : "NO");

const app = express();
app.use(cors({ origin: serverConfig.corsOrigins }));
app.use(express.json());

// Initialize services for multi-modal route optimization
const routeCalculator = new RouteCalculator();

// Initialize the request controller for specialized route handling
const requestController = new RequestController();

const GOOGLE_ROUTES_URL = googleMapsConfig.routesApiBaseUrl;
const API_KEY = process.env.MAPS_API_KEY;

const ReqSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
});

const RouteReqSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  modes: z
    .array(
      z.enum([
        "driving",
        "transit",
        "walking",
        "cycling",
        "hybrid",
        "ev",
        "rideshare",
      ]),
    )
    .default(["driving", "transit", "walking", "cycling"]),
  options: z
    .object({
      ev: z
        .object({ gridIntensity: z.number(), efficiency: z.number() })
        .optional(),
      rideshare: z.object({ occupancy: z.number() }).optional(),
      hybrid: z.object({}).optional(),
    })
    .optional(),
});

const KG_CO2_PER_L = { GASOLINE: 2.31, DIESEL: 2.68 };

function asLocation(input) {
  const m = input.match(/^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/);
  if (m) {
    const [lat, lng] = input.split(",").map((s) => parseFloat(s.trim()));
    return { location: { latLng: { latitude: lat, longitude: lng } } };
  }
  return { address: input };
}

// Multi-modal route optimization endpoint
app.post("/api/routes", async (req, res) => {
  try {
    const parsed = RouteReqSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { origin, destination, modes, options = {} } = parsed.data;

    // Use the RouteCalculator to get optimized routes
    const routes = await routeCalculator.calculateRoutes({
      origin,
      destination,
      transportModes: modes,
      options,
    });

    // Sort routes by carbon footprint (lowest first - most eco-friendly)
    routes.sort((a, b) => a.carbonFootprint - b.carbonFootprint);

    res.json({
      origin,
      destination,
      results: routes.map((route) => ({
        mode: route.mode || "unknown",
        distanceKm: +route.distance.toFixed(3),
        durationMin: +route.duration.toFixed(1),
        emissionsG: route.carbonFootprint,
        path: route.path,
      })),
      metadata: {
        totalModes: routes.length,
        mostEcoFriendly: routes[0]?.mode,
        biggestImpact: routes[routes.length - 1]?.mode,
        factorsVersion: "2025.01",
      },
    });
  } catch (error) {
    console.error("Route calculation error:", error);
    res.status(500).json({
      error: "Failed to calculate routes",
      detail: error.message,
    });
  }
});

// Route endpoints using RequestController
app.post("/api/routes/fastest", (req, res) => requestController.getFastestRoute(req, res));
app.post("/api/routes/balanced", (req, res) => requestController.getBalancedRoute(req, res));
app.post("/api/routes/eco", (req, res) => requestController.getEcoRoute(req, res));
app.post("/api/routes/all", (req, res) => requestController.getAllRouteTypes(req, res));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/emissions/drive", async (req, res) => {
  const parsed = ReqSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { origin, destination } = parsed.data;

  try {
    const body = {
      origin: asLocation(origin),
      destination: asLocation(destination),
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      extraComputations: ["FUEL_CONSUMPTION"],
      languageCode: "en-US",
      units: "METRIC",
      regionCode: "CA",
    };

    const { data } = await axios.post(GOOGLE_ROUTES_URL, body, {
      headers: {
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "routes.distanceMeters,routes.duration,routes.travelAdvisory.fuelConsumptionMicroliters",
      },
      timeout: 10000,
    });

    const route = data?.routes?.[0];
    if (!route) return res.status(404).json({ error: "No route found" });

    const distanceKm = (route.distanceMeters ?? 0) / 1000;
    const durationSec =
      parseFloat(String(route.duration ?? "0s").replace("s", "")) || 0;
    const fuelL =
      (route.travelAdvisory?.fuelConsumptionMicroliters ?? 0) / 1_000_000;
    const co2eKg = fuelL * KG_CO2_PER_L['GASOLINE'];

    res.json({
      distanceKm: +distanceKm.toFixed(3),
      durationMin: +(durationSec / 60).toFixed(1),
      fuelLiters: +fuelL.toFixed(3),
      co2eKg: +co2eKg.toFixed(3),
    });
  } catch (e) {
    console.error(e?.response?.data || e.message);
    res.status(500).json({
      error: "Routes API error",
      detail: e?.response?.data || e.message,
    });
  }
});

const port = process.env.PORT || 8080;
/** Bind 0.0.0.0 so Windows browser can hit it via localhost */
app.listen(port, "0.0.0.0", () => {
  console.log(`API on http://localhost:${port}`);
});
