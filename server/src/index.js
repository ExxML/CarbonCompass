import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { z } from 'zod';

dotenv.config();

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

const GOOGLE_ROUTES_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';
const API_KEY = process.env.MAPS_API_KEY;
if (!API_KEY) throw new Error('Set MAPS_API_KEY in .env');

const ReqSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  fuelType: z.enum(['GASOLINE', 'DIESEL']).default('GASOLINE'),
});

const KG_CO2_PER_L = { GASOLINE: 2.31, DIESEL: 2.68 };

function asLocation(input) {
  const m = input.match(/^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/);
  if (m) {
    const [lat, lng] = input.split(',').map((s) => parseFloat(s.trim()));
    return { location: { latLng: { latitude: lat, longitude: lng } } };
  }
  return { address: input };
}

app.post('/api/emissions/drive', async (req, res) => {
  const parsed = ReqSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { origin, destination, fuelType } = parsed.data;

  try {
    const body = {
      origin: asLocation(origin),
      destination: asLocation(destination),
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
      extraComputations: ['FUEL_CONSUMPTION'],
      languageCode: 'en-US',
      units: 'METRIC',
      regionCode: 'CA',
    };

    const { data } = await axios.post(GOOGLE_ROUTES_URL, body, {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask':
          'routes.distanceMeters,routes.duration,routes.travelAdvisory.fuelConsumptionMicroliters',
      },
      timeout: 10000,
    });

    const route = data?.routes?.[0];
    if (!route) return res.status(404).json({ error: 'No route found' });

    const distanceKm = (route.distanceMeters ?? 0) / 1000;
    const durationSec = parseFloat(String(route.duration ?? '0s').replace('s', '')) || 0;
    const fuelL = (route.travelAdvisory?.fuelConsumptionMicroliters ?? 0) / 1_000_000;
    const co2eKg = fuelL * KG_CO2_PER_L[fuelType];

    res.json({
      distanceKm: +distanceKm.toFixed(3),
      durationMin: +(durationSec / 60).toFixed(1),
      fuelLiters: +fuelL.toFixed(3),
      co2eKg: +co2eKg.toFixed(3),
    });
  } catch (e) {
    console.error(e?.response?.data || e.message);
    res.status(500).json({ error: 'Routes API error', detail: e?.response?.data || e.message });
  }
});

const port = process.env.PORT || 8080;
/** Bind 0.0.0.0 so Windows browser can hit it via localhost */
app.listen(port, '0.0.0.0', () => {
  console.log(`API on http://localhost:${port}`);
});
