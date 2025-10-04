import Route from '../models/Route.js';

import CarbonCalculator from './CarbonCalculator.js';

class RouteCalculator {
    constructor(routeDataSource) {
        this.routeDataSource = routeDataSource; // e.g., API object
        this.carbonCalculator = new CarbonCalculator();
    }

    calculateRoutes(request) {
        const rawRoutes = this.routeDataSource.getRoutes(request.origin, request.destination);

        return rawRoutes.map(r => new Route(
            r.path,
            r.distance,
            r.duration,
            this.carbonCalculator.calculate(r, request.getUserPreferences().transportModes[0])
        ));
    }
}

export default RouteCalculator;
