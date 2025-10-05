# Google Maps Directions API Integration - Complete Implementation

## Overview

Successfully implemented a complete Google Maps Directions API integration for your Carbon Compass application. The system allows users to get directions from point A to point B using the SearchPanel, which sends requests to your backend server, which then queries the Google Maps API and returns detailed route information including carbon emissions.

## Architecture

### Backend Structure (`/server`)

```
server/
├── src/
│   ├── index.js              # Main Express server
│   ├── routes/
│   │   └── directions.js     # Directions API routes
│   ├── services/
│   │   └── googleMaps.js     # Google Maps API service
│   ├── middleware/
│   │   └── validation.js     # Request validation with Zod
│   └── utils/
│       └── errors.js         # Error handling utilities
├── package.json
└── .env                      # Contains MAPS_API_KEY and PORT
```

### Frontend Structure (`/client`)

```
client/src/
├── components/
│   ├── SearchPanel.jsx       # Updated search panel with origin/destination
│   ├── MapView.jsx          # Updated to handle route data
│   └── DirectionsComponent.jsx # Example standalone component
├── hooks/
│   └── useDirections.js     # Custom hook for directions management
├── services/
│   └── apiService.js        # API communication service
└── utils/
    └── decodePolyline.js    # Google polyline decoder (already existed)
```

## Key Features Implemented

### ✅ Backend API Endpoints

1. **POST `/api/directions`** - Get directions with request body
2. **GET `/api/directions`** - Get directions with query parameters
3. **POST `/api/directions/carbon`** - Calculate carbon emissions for distance/mode
4. **GET `/health`** - Health check endpoint

### ✅ API Features

- **Multiple Route Options**: Returns alternative routes
- **Carbon Emissions Calculation**: Calculates CO₂ emissions per route
- **Travel Mode Support**: driving, walking, bicycling, transit
- **Input Validation**: Using Zod for request validation
- **Error Handling**: Comprehensive error handling
- **Google Places Autocomplete**: Integration for address suggestions

### ✅ Frontend Integration

- **Updated SearchPanel**: Now has both origin and destination inputs
- **Auto-triggered Directions**: Automatically gets directions when both inputs are filled
- **Real-time Route Display**: Shows route polylines on the map
- **Loading States**: Shows loading indicators during API calls
- **Error Handling**: Displays errors to users
- **Route Summary**: Shows distance, duration, and carbon emissions

## API Response Example

```json
{
  "success": true,
  "data": {
    "status": "OK",
    "routes": [
      {
        "summary": "W Pender St/BC-7A and W Georgia St/BC-1A/BC-99 N",
        "distance": {
          "text": "1.6 km",
          "value": 1629
        },
        "duration": {
          "text": "6 mins",
          "value": 347
        },
        "start_address": "1055 Canada Pl, Vancouver, BC V6C 0C3, Canada",
        "end_address": "Stanley Park, Vancouver, BC V6G 1Z4, Canada",
        "start_location": { "lat": 49.2886086, "lng": -123.1172585 },
        "end_location": { "lat": 49.29383989999999, "lng": -123.1356856 },
        "polyline": "ytykHzimnVk@~CAZB^J`@tFvJoI`c@k@rCe@~BgAxFGZIJUlAc@`C?f@_@r@cD`GsEdIuEnIiArB",
        "carbon_emissions": {
          "emissions_kg": 0.342,
          "emissions_factor": 0.21,
          "travel_mode": "driving",
          "distance_km": 1.629
        }
      }
    ]
  }
}
```

## Configuration

### Environment Variables

- **Backend** (`.env`): `MAPS_API_KEY` and `PORT=3001`
- **Frontend** (optional `.env`): `VITE_API_URL=http://localhost:3001`

### Default Settings

- **Travel Mode**: `driving` (as requested)
- **Units**: `metric`
- **Country Restriction**: Canada (for autocomplete)
- **Alternatives**: `true` (returns multiple route options)

## Running the Application

### Backend (Port 3001)

```bash
cd server
npm run dev  # Development with hot reload
npm start    # Production
```

### Frontend (Port 5174)

```bash
cd client
npm run dev
```

## Testing the API

```bash
# Test directions endpoint
curl -X POST http://localhost:3001/api/directions \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Vancouver Convention Centre, Vancouver, BC",
    "destination": "Stanley Park, Vancouver, BC",
    "mode": "driving"
  }'

# Test health endpoint
curl http://localhost:3001/health
```

## Carbon Emissions Calculation

The system calculates carbon emissions using these factors:

- **Driving**: 0.160 kg CO₂ per km (average car)
- **Walking**: 0 kg CO₂ per km
- **Bicycling**: 0 kg CO₂ per km
- **Transit**: 0.80 kg CO₂ per km (average public transport)

## Integration Points

1. **SearchPanel → Backend**: User inputs addresses, component calls API
2. **Backend → Google Maps**: Server queries Google Directions API
3. **Backend → Frontend**: Returns processed route data with emissions
4. **MapView**: Displays route polylines and markers on the map
5. **CarbonPanel**: Can display carbon emission data for the route

## Next Steps

The system is now fully functional! Users can:

1. Enter origin and destination in the SearchPanel
2. Get real-time directions with carbon emissions
3. See routes displayed on the map
4. Compare alternative routes and their environmental impact

The integration follows your requirements:

- ✅ Google Maps Directions API integration
- ✅ Backend server handling requests
- ✅ Frontend sending queries to backend
- ✅ Default mode set to driving (cars)
- ✅ Working with existing SearchPanel component structure
