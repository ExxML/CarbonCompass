/**
 * Route Model - Represents a calculated route with distance, duration, and emissions data
 */
class Route {
    /**
     * Constructor for Route model
     * @param {Array} path - Array of path coordinates/points for the route
     * @param {number} distanceKm - Distance in kilometers
     * @param {number} durationMin - Duration in minutes
     * @param {number} emissions - Carbon emissions (in kg CO2e or grams depending on context)
     */
    constructor(path, distanceKm, durationMin, emissions) {
        this.path = path || [];
        this.distanceKm = distanceKm || 0;
        this.durationMin = durationMin || 0;
        this.emissions = emissions || 0;
    }

    /**
     * Get a summary of the route data formatted for API responses
     * @returns {Object} Route summary with key metrics
     */
    getSummary() {
        return {
            path: this.path,
            distanceKm: +this.distanceKm.toFixed(3),
            durationMin: +this.durationMin.toFixed(1),
            emissions: +this.emissions.toFixed(3)
        };
    }

    /**
     * Get the carbon footprint (alias for emissions for backward compatibility)
     * @returns {number} Carbon footprint value
     */
    get carbonFootprint() {
        return this.emissions;
    }
}

export default Route;
