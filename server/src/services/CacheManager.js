class CacheManager {
    constructor() {
        this.cachedRoutes = new Map(); // Map<RouteRequest, Route>
    }

    getCachedRoute(request) {
        return this.cachedRoutes.get(request);
    }

    cacheRoute(request, route) {
        this.cachedRoutes.set(request, route);
    }
}

export default CacheManager;
