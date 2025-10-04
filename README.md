<div align="center">

# 🌍 Low-Carbon Route Planner

Estimate and compare the carbon footprint for multiple transportation modes between two points using the Google Maps Platform.

</div>

## ✨ Overview
This project helps users choose more sustainable travel options by calculating estimated greenhouse gas (GHG) emissions for different transportation modes (e.g., walking, cycling, public transit, driving, ride‑share, EV, rail, flights (future)). A user provides (or selects on the map) an origin (Point A) and destination (Point B); the system retrieves routing data via the Google Maps Platform API and applies emission factors to approximate the carbon footprint per route & mode.

> NOTE: Emission values are estimates intended for educational / awareness purposes—not for regulatory or financial reporting.

## 🎯 Core Features
- Multi‑mode route retrieval (Driving, Transit, Bicycling, Walking; extendable to EV, Rail, Flight)
- Distance & duration comparison
- Carbon emission estimation (grams CO₂e) per mode & per trip
- Emission factor breakdown & assumptions transparency
- Map visualization with selectable modes
- Mobile‑friendly responsive UI (TailwindCSS)
- Modular API layer for future data sources (e.g., OpenRouteService, GBFS micro‑mobility feeds)

## 🧰 Tech Stack
Frontend:
- React.js + Vite (or CRA) + TypeScript (optional)
- TailwindCSS for utility-first styling
- Axios / Fetch for API calls
- Google Maps JavaScript API + Places + Directions (optionally Distance Matrix)

Backend:
- Node.js + Express.js
- Emission factor engine (config-driven)
- Rate limiting & input validation (Helmet / express-validator suggested)
- Optional caching layer (in‑memory or Redis) for repeated route queries

Tooling / Infra (optional future):
- ESLint + Prettier

## 🗺️ Architecture
```
client/        # React frontend: map, form, results visualization
server/        # Express API: routing proxy + carbon calculation service
	└─ src/
			 emissions/   # Emission factors & calculators
			 routes/      # REST endpoints
			 services/    # Google Maps wrapper, caching
			 utils/       # Validation, normalization
```

High-Level Flow:
1. User selects origin & destination (autocomplete or map click).
2. Frontend requests candidate routes per mode from backend.
3. Backend calls Google Maps Directions / Distance Matrix APIs.
4. Distances & mode metadata fed into emission calculator.
5. Emissions returned (g CO₂e) + normalized comparisons (e.g., % less than driving).
6. UI displays table, charts, and sustainability tips.

## 🧮 Carbon Calculation Methodology
For each mode we apply:  
`emissions_g = distance_km * emission_factor_g_per_km`  (for occupant-level factors)  
OR  
`emissions_g = (distance_km * vehicle_factor) / avg_passengers` (when factors are per vehicle-km).

Example (illustrative — replace with sourced values):
| Mode | Emission Factor (g CO₂e / km / passenger) | Source Notes |
|------|--------------------------------------------|--------------|
| Walking | ~0 | Negligible direct emissions |
| Cycling | ~0 | Manufacturing lifecycle excluded |
| Public Transit (Bus) | 80 | Averaged occupancy (regional) |
| Rail (Commuter) | 45 | Assumes moderate electrification |
| Gasoline Car (Single Occupant) | 192 | Typical compact @ 8.0 L/100km |
| Gasoline Car (2 Occupants) | 96 | Shared occupancy divides impact |
| Hybrid Car | 120 | Mixed urban cycle |
| EV (Grid Avg) | 55 | Depends heavily on grid intensity |
| Rideshare (Assumed 1.3 pax) | 148 | Includes deadheading factor |

You should replace factors with region-specific, peer-reviewed, or government inventory data (e.g., IPCC, EPA, UK DEFRA GHG Conversion Factors) and cite precisely in `server/src/emissions/sources.md` (recommended file to add).

Edge Considerations:
- Rounding: present to nearest whole gram or show kg with 2 decimals when > 1000 g.
- Short distances (< 300 m): treat as zero or encourage active travel.
- Data gaps (no transit route): mark mode as N/A instead of 0.
- EV variability: allow user to input kWh/100km & grid g CO₂/kWh.

## 🔐 Environment Variables
Create a `.env` file in both `client/` (if needed for build-time injection) and `server/` directories.

Server `.env` (example):
```
PORT=5000
GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
CACHE_TTL_SECONDS=600
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60
```

Frontend `.env` (Vite style):
```
VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
VITE_API_BASE_URL=http://localhost:5000
```

Never commit real API keys. Use `.env.example` to document required variables.

## 🚀 Getting Started


### Useful Commands
| Purpose                          | Folder   | Command                              |
| -------------------------------- | -------- | ------------------------------------ |
| Start backend (Express)          | `server` | `npm run dev`                        |
| Start frontend (Vite)            | `client` | `npm run dev -- --host`              |
| Build frontend for production    | `client` | `npm run build`                      |
| Start backend in production mode | `server` | `npm start`                          |
| Clean node_modules               | any      | `rm -rf node_modules && npm install` |
| **ESLint: lint backend**         | `server` | `npx eslint .`                       |
| **ESLint: fix backend**          | `server` | `npx eslint . --fix`                 |
| **ESLint: lint frontend**        | `client` | `npx eslint .`                       |
| **ESLint: fix frontend**         | `client` | `npx eslint . --fix`                 |



### ⚙️ Requirements

- Node.js **v18+** (use NVM to install and switch)
- npm **v9+**
- Google Cloud project with:
  - **Routes API** (for fuel consumption)
  - **Maps JavaScript API** (for map display)
- API keys:
  - Browser key → frontend (`VITE_GOOGLE_MAPS_API_KEY`)
  - Server key → backend (`MAPS_API_KEY`)

### Installation
From project root:
```
cd server && npm install
cd ../client && npm install
```

### Development Run (concurrently)
In two terminals:
```
cd server && npm run dev
cd client && npm run dev
```
Then open the displayed local URL (e.g., http://localhost:5173).

### Production Build (example)
```
cd client && npm run build
# Serve static build from an Express static middleware or a CDN
```

## 📡 API (Proposed)
Base URL: `http://localhost:5000/api`

| Endpoint | Method | Description | Query / Body Params |
|----------|--------|-------------|---------------------|
| `/health` | GET | Service healthcheck | — |
| `/routes` | GET | Get routes & emissions for modes | `origin`, `destination`, `modes=driving,transit,...` |
| `/emissions/factors` | GET | List current emission factors | optional `region` |
| `/emissions/custom` | POST | Calculate using custom user factors | JSON: distances + factors |

Sample request:
```
GET /api/routes?origin=49.2827,-123.1207&destination=49.25,-123.001&modes=driving,transit,walking,cycling
```
Sample trimmed response:
```json
{
	"origin": "49.2827,-123.1207",
	"destination": "49.25,-123.001",
	"results": [
		{ "mode": "driving", "distance_km": 12.4, "duration_min": 19, "emissions_g": 2380 },
		{ "mode": "transit", "distance_km": 13.1, "duration_min": 27, "emissions_g": 1040 },
		{ "mode": "cycling", "distance_km": 11.8, "duration_min": 36, "emissions_g": 0 }
	],
	"metadata": { "factors_version": "2025.01" }
}
```

## 🧭 Frontend UX Notes
- Autocomplete search bars for origin/destination.
- Map with polyline overlays per mode (toggle visibility).
- Comparison panel: bar chart (g CO₂e), percent difference vs baseline (driving), suggestion text.
- Accessibility: ARIA labels, colorblind-safe palette.

## 🔄 Extensibility Ideas
- User profiles & historical trip carbon savings
- Flight segment estimation (Great-circle distance + RFI multiplier)
- Car model-specific emission factors (VIN decode / selection)
- Gamification: badges for low-carbon choices
- Offline caching (Service Worker) for last results
- Multi-leg journey planner / itinerary emission totals

## ✅ Roadmap (Example Milestones)
1. MVP: Driving vs Transit vs Active modes
2. Add emission factor configuration & endpoint
3. Add EV + user-customizable grid intensity
4. Add caching + rate limiting
5. Add charts & shareable permalinks
6. Add user accounts & historical analytics

## 🧪 Testing Strategy (Recommended)
- Unit: emission factor math, unit conversions.
- Integration: mock Google Maps responses; snapshot route normalization.
- E2E: Cypress/Playwright for user trip flow.
- Performance: Cache effectiveness benchmarks.

## 🔍 Validation & Edge Cases
- Invalid coordinates -> 400 with structured error JSON.
- Origin == Destination -> zero-distance handling.
- API quota errors -> 503 with retry-after header.
- Partial mode failures -> return successful modes + warnings array.

## 🛡️ Security & Privacy
- Do not log raw API keys.
- Minimal PII: only coordinate pairs (consider coarse rounding for analytics).
- Consider adding a Content Security Policy and HTTP security headers.

## 📚 References / Suggested Sources
- IPCC Sixth Assessment Report (transport sector summaries)
- UK DEFRA GHG Conversion Factors
- EPA Emission Factors for Greenhouse Gas Inventories
- IEA Grid Emissions Intensity Data

## 🤝 Contributing
1. Fork & create a feature branch.
2. Add/Update tests for any change in emission logic.
3. Run lint + tests, open PR referencing issue.
4. Clearly cite any new emission factor sources.

## 📄 License
This project is licensed under the terms of the `LICENSE` file in the repository (commonly MIT unless changed).

## 🙋 FAQ (Quick)
Q: Why are walking/cycling shown as 0?  
A: We omit embodied manufacturing emissions for simplicity; optionally add lifecycle factors later.

Q: Why do my transit emissions seem high?  
A: Occupancy assumptions drive per-passenger intensity; adjust factors regionally.

Q: Can I export results?  
A: Planned feature (CSV / shareable link) on roadmap milestone 5.

## 🗣️ Disclaimer
All emission figures are estimates; actual emissions vary based on vehicle specifics, traffic, energy mix, and occupancy. Not suitable for regulated reporting.

---
Feel free to adapt this README as the implementation evolves. Add real factors, cite sources, and keep transparency paramount. 🌱