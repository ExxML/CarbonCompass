/**
 * CarbonCalculator - Handles carbon emission calculations for different transportation modes
 * 
 * This service calculates the environmental impact of various transportation methods by applying
 * specific emission factors to route distances. It supports multiple transport modes including
 * walking, cycling, public transit, driving, electric vehicles, and ridesharing.
 * 
 * The calculator uses standardized emission factors (grams of CO₂ equivalent per kilometer)
 * based on transportation research and can be customized for different regions or vehicle types.
 * 
 * Key responsibilities:
 * - Store and manage emission factors for different transportation modes
 * - Calculate carbon footprint for individual routes based on distance and transport method
 * - Support customization options like EV grid intensity and rideshare occupancy
 * - Compare carbon emissions between different route options
 * - Provide transparent emission factor data for user education
 */

class CarbonCalculator {
       /**
     * Constructor - Initializes emission factors for all supported transportation modes
     * 
     * Sets up a comprehensive mapping of transportation modes to their carbon emission factors
     * in grams of CO₂ equivalent per kilometer per passenger. These factors are based on
     * standard values from transportation research and can be updated as new data becomes available.
     * 
     * The constructor also initializes default settings for:
     * - Grid electricity intensity for electric vehicle calculations (can be customized)
     * - Base emission factors for walking, cycling, transit, rail, driving, rideshare, hybrid vehicles, and flights
     * - Support for mode-specific customizations like EV efficiency and rideshare occupancy
     * 
     * All emission factors follow the principle of grams CO₂e per kilometer per passenger,
     * allowing for fair comparison across different transportation methods and occupancy levels.
     */

    constructor() {
        // Emission factors in g CO₂e per km per passenger
        // Based on standard values - replace with region-specific data
        this.emissionFactors = {
            walking: 0,           // Negligible direct emissions
            cycling: 0,           // Manufacturing lifecycle excluded for simplicity
            transit: 80,          // Bus averaged occupancy (regional)
            rail: 45,             // Commuter rail, moderate electrification
            driving: 192,         // Gasoline car, single occupant, compact @ 8.0 L/100km
            rideshare: 148,       // Includes deadheading factor, 1.3 avg passengers
            hybrid: 120,          // Mixed urban cycle
            ev: 55,               // Depends on grid intensity - use average
            flight: 285           // Short-haul flight with radiative forcing
        };
        
        // Grid intensity for EV calculations (g CO₂/kWh)
        this.gridIntensity = 400; // Average grid - make configurable
    }

    calculate(route, transportMode, options = {}) {
        const distanceKm = route.distance;
        const mode = transportMode.toLowerCase();
        
        // Handle EV with custom grid intensity
        if (mode === 'ev' && options.gridIntensity) {
            const kwhPerKm = options.evEfficiency || 0.2; // kWh per km
            return distanceKm * kwhPerKm * options.gridIntensity;
        }
        
        // Handle rideshare with custom occupancy
        if (mode === 'rideshare' && options.occupancy) {
            const baseFactor = this.emissionFactors.driving;
            return (distanceKm * baseFactor) / options.occupancy;
        }
        
        // Standard calculation
        const factor = this.emissionFactors[mode] || 0;
        return Math.round(distanceKm * factor);
    }

    compare(route1, route2) {
        return route1.carbonFootprint - route2.carbonFootprint;
    }

    getEmissionFactor(mode) {
        return this.emissionFactors[mode.toLowerCase()] || 0;
    }

    // Calculate emissions for multiple modes
    calculateMultipleModes(route, modes, options = {}) {
        const results = {};
        modes.forEach(mode => {
            results[mode] = this.calculate(route, mode, options[mode] || {});
        });
        return results;
    }
}

export default CarbonCalculator;