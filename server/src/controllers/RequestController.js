import axios from 'axios';
import { Route, RouteRequest } from '../models/index.js';
import { RouteCalculator, CarbonCalculator } from '../services/index.js';
import { z } from 'zod';

class RequestController {
    constructor() {
        this.routeCalculator = new RouteCalculator(this);
        this.carbonCalculator = new CarbonCalculator();

        // Zod schema for validating route requests
        this.routeRequestSchema = z.object({
            origin: z.string().min(1, "Origin is required"),
            destination: z.string().min(1, "Destination is required"),
            userId: z.string().optional(),
            fuelType: z.enum(['GASOLINE']).default('GASOLINE'),
        });

        // Google Maps API configuration
        this.GOOGLE_ROUTES_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';
        this.API_KEY = process.env.MAPS_API_KEY;

        // CO2 emission factors per liter of fuel (gasoline only)
        this.KG_CO2_PER_L = { GASOLINE: 2.31 };

        if (!this.API_KEY) {
            throw new Error('Set MAPS_API_KEY in .env');
        }
    }

    // Helper function to format location input (lat,lng or address)
    asLocation(input) {
        const m = input.match(/^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/);
        if (m) {
            const [lat, lng] = input.split(',').map((s) => parseFloat(s.trim()));
            return { location: { latLng: { latitude: lat, longitude: lng } } };
        }
        return { address: input };
    }

    // Helper function to make Google Maps API request
    async makeRoutesRequest(body, fieldMask) {
        return await axios.post(this.GOOGLE_ROUTES_URL, body, {
            headers: {
                'X-Goog-Api-Key': this.API_KEY,
                'X-Goog-FieldMask': fieldMask,
            },
            timeout: 10000,
        });
    }

    // Helper function to process route data
    processRouteData(routeData, fuelType) {
        const route = routeData?.routes?.[0];
        if (!route) return null;

        const distanceKm = (route.distanceMeters ?? 0) / 1000;
        const durationSec = parseFloat(String(route.duration ?? '0s').replace('s', '')) || 0;
        const fuelL = (route.travelAdvisory?.fuelConsumptionMicroliters ?? 0) / 1_000_000;
        const co2eKg = fuelL * this.KG_CO2_PER_L[fuelType];

        return {
            distanceKm: +distanceKm.toFixed(3),
            durationMin: +(durationSec / 60).toFixed(1),
            fuelLiters: +fuelL.toFixed(3),
            co2eKg: +co2eKg.toFixed(3),
        };
    }

    // Helper function to create route object
    createRouteObject(routeData, fuelType, transportMode = 'DRIVE') {
        const processedData = this.processRouteData(routeData, fuelType);
        if (!processedData) return null;

        // Create path from route polyline (simplified)
        const path = routeData?.routes?.[0]?.polyline?.encodedPolyline ?
            [{ lat: 0, lng: 0 }] : // Placeholder - would need proper polyline decoding
            [];

        return new Route(
            path,
            processedData.distanceKm,
            processedData.durationMin,
            processedData.co2eKg
        );
    }

    // POST /api/routes/fastest - Get the fastest route (disregarding carbon emissions)
    async getFastestRoute(req, res) {
        try {
            const parsed = this.routeRequestSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    error: 'Invalid request data',
                    details: parsed.error.flatten()
                });
            }

            const { origin, destination, fuelType } = parsed.data;

            const requestBody = {
                origin: this.asLocation(origin),
                destination: this.asLocation(destination),
                travelMode: 'DRIVE',
                routingPreference: 'TRAFFIC_AWARE_OPTIMAL', // Fastest route
                extraComputations: ['FUEL_CONSUMPTION'],
                languageCode: 'en-US',
                units: 'METRIC',
                regionCode: 'CA',
            };

            const response = await this.makeRoutesRequest(
                requestBody,
                'routes.distanceMeters,routes.duration,routes.travelAdvisory.fuelConsumptionMicroliters'
            );

            const route = this.createRouteObject(response.data, fuelType, 'DRIVE');

            if (!route) {
                return res.status(404).json({ error: 'No fastest route found' });
            }

            res.json({
                type: 'fastest',
                route: route.getSummary(),
                message: 'Fastest route calculated successfully'
            });

        } catch (error) {
            console.error('Fastest route error:', error?.response?.data || error.message);
            res.status(500).json({
                error: 'Failed to calculate fastest route',
                detail: error?.response?.data || error.message
            });
        }
    }

    // POST /api/routes/balanced - Get route with minimal emissions (balanced approach)
    async getBalancedRoute(req, res) {
        try {
            const parsed = this.routeRequestSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    error: 'Invalid request data',
                    details: parsed.error.flatten()
                });
            }

            const { origin, destination, fuelType } = parsed.data;

            const requestBody = {
                origin: this.asLocation(origin),
                destination: this.asLocation(destination),
                travelMode: 'DRIVE',
                routingPreference: 'TRAFFIC_AWARE', // Balanced approach
                extraComputations: ['FUEL_CONSUMPTION'],
                languageCode: 'en-US',
                units: 'METRIC',
                regionCode: 'CA',
            };

            const response = await this.makeRoutesRequest(
                requestBody,
                'routes.distanceMeters,routes.duration,routes.travelAdvisory.fuelConsumptionMicroliters'
            );

            const route = this.createRouteObject(response.data, fuelType, 'DRIVE');

            if (!route) {
                return res.status(404).json({ error: 'No balanced route found' });
            }

            res.json({
                type: 'balanced',
                route: route.getSummary(),
                message: 'Balanced route calculated successfully'
            });

        } catch (error) {
            console.error('Balanced route error:', error?.response?.data || error.message);
            res.status(500).json({
                error: 'Failed to calculate balanced route',
                detail: error?.response?.data || error.message
            });
        }
    }

    // POST /api/routes/eco - Get route with 0 emissions (walking, cycling, public transit)
    async getEcoRoute(req, res) {
        try {
            const parsed = this.routeRequestSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    error: 'Invalid request data',
                    details: parsed.error.flatten()
                });
            }

            const { origin, destination } = parsed.data;

            // Try multiple eco-friendly transport modes in order of preference
            const ecoModes = [
                { mode: 'TRANSIT', name: 'Public Transit' },
                { mode: 'WALK', name: 'Walking' },
                { mode: 'BICYCLE', name: 'Cycling' }
            ];

            let route = null;
            let selectedMode = null;

            for (const transport of ecoModes) {
                try {
                    const requestBody = {
                        origin: this.asLocation(origin),
                        destination: this.asLocation(destination),
                        travelMode: transport.mode,
                        languageCode: 'en-US',
                        units: 'METRIC',
                        regionCode: 'CA',
                    };

                    const fieldMask = transport.mode === 'TRANSIT'
                        ? 'routes.distanceMeters,routes.duration'
                        : 'routes.distanceMeters,routes.duration';

                    const response = await this.makeRoutesRequest(requestBody, fieldMask);

                    if (response.data?.routes?.[0]) {
                        // For eco routes, carbon footprint is 0
                        const routeData = response.data.routes[0];
                        const distanceKm = (routeData.distanceMeters ?? 0) / 1000;
                        const durationSec = parseFloat(String(routeData.duration ?? '0s').replace('s', '')) || 0;

                        route = new Route(
                            [], // Path data not available in this format
                            distanceKm,
                            durationSec / 60,
                            0 // Zero emissions for eco routes
                        );

                        selectedMode = transport;
                        break;
                    }
                } catch (error) {
                    // Continue to next transport mode if this one fails
                    console.log(`${transport.name} route calculation failed, trying next mode...`);
                    continue;
                }
            }

            if (!route) {
                return res.status(404).json({
                    error: 'No eco-friendly route found',
                    message: 'Unable to find walking, cycling, or public transit routes for this journey'
                });
            }

            res.json({
                type: 'eco',
                transportMode: selectedMode.name,
                route: route.getSummary(),
                message: `${selectedMode.name} route calculated successfully (0 emissions)`
            });

        } catch (error) {
            console.error('Eco route error:', error?.response?.data || error.message);
            res.status(500).json({
                error: 'Failed to calculate eco route',
                detail: error?.response?.data || error.message
            });
        }
    }

    // POST /api/routes/all - Get all three route types in one request
    async getAllRouteTypes(req, res) {
        try {
            const parsed = this.routeRequestSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    error: 'Invalid request data',
                    details: parsed.error.flatten()
                });
            }

            const { origin, destination, fuelType } = parsed.data;

            // Calculate all three route types
            const [fastestResponse, balancedResponse, ecoResponse] = await Promise.allSettled([
                this.getFastestRouteInternal(origin, destination, fuelType),
                this.getBalancedRouteInternal(origin, destination, fuelType),
                this.getEcoRouteInternal(origin, destination)
            ]);

            const results = {
                fastest: fastestResponse.status === 'fulfilled' ? fastestResponse.value : null,
                balanced: balancedResponse.status === 'fulfilled' ? balancedResponse.value : null,
                eco: ecoResponse.status === 'fulfilled' ? ecoResponse.value : null
            };

            // Check if at least one route type was successful
            const hasResults = Object.values(results).some(result => result !== null);

            if (!hasResults) {
                return res.status(404).json({
                    error: 'No routes found',
                    message: 'Unable to calculate any route types for this journey'
                });
            }

            res.json({
                origin,
                destination,
                routes: results,
                message: 'Route calculations completed'
            });

        } catch (error) {
            console.error('All routes error:', error.message);
            res.status(500).json({
                error: 'Failed to calculate routes',
                detail: error.message
            });
        }
    }

    // Internal helper methods (not exposed as endpoints)
    async getFastestRouteInternal(origin, destination, fuelType) {
        const requestBody = {
            origin: this.asLocation(origin),
            destination: this.asLocation(destination),
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
            extraComputations: ['FUEL_CONSUMPTION'],
            languageCode: 'en-US',
            units: 'METRIC',
            regionCode: 'CA',
        };

        const response = await this.makeRoutesRequest(
            requestBody,
            'routes.distanceMeters,routes.duration,routes.travelAdvisory.fuelConsumptionMicroliters'
        );

        return this.createRouteObject(response.data, fuelType, 'DRIVE');
    }

    async getBalancedRouteInternal(origin, destination, fuelType) {
        const requestBody = {
            origin: this.asLocation(origin),
            destination: this.asLocation(destination),
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE',
            extraComputations: ['FUEL_CONSUMPTION'],
            languageCode: 'en-US',
            units: 'METRIC',
            regionCode: 'CA',
        };

        const response = await this.makeRoutesRequest(
            requestBody,
            'routes.distanceMeters,routes.duration,routes.travelAdvisory.fuelConsumptionMicroliters'
        );

        return this.createRouteObject(response.data, fuelType, 'DRIVE');
    }

    async getEcoRouteInternal(origin, destination) {
        const ecoModes = [
            { mode: 'TRANSIT', name: 'Public Transit' },
            { mode: 'WALK', name: 'Walking' },
            { mode: 'BICYCLE', name: 'Cycling' }
        ];

        for (const transport of ecoModes) {
            try {
                const requestBody = {
                    origin: this.asLocation(origin),
                    destination: this.asLocation(destination),
                    travelMode: transport.mode,
                    languageCode: 'en-US',
                    units: 'METRIC',
                    regionCode: 'CA',
                };

                const fieldMask = transport.mode === 'TRANSIT'
                    ? 'routes.distanceMeters,routes.duration'
                    : 'routes.distanceMeters,routes.duration';

                const response = await this.makeRoutesRequest(requestBody, fieldMask);

                if (response.data?.routes?.[0]) {
                    const routeData = response.data.routes[0];
                    const distanceKm = (routeData.distanceMeters ?? 0) / 1000;
                    const durationSec = parseFloat(String(routeData.duration ?? '0s').replace('s', '')) || 0;

                    return {
                        transportMode: transport.name,
                        route: new Route([], distanceKm, durationSec / 60, 0)
                    };
                }
            } catch (error) {
                continue;
            }
        }

        return null;
    }
}

export default RequestController;