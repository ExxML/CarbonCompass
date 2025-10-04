class RouteRequest {
    constructor(origin, destination, user, timestamp = new Date()) {
        this.origin = origin;
        this.destination = destination;
        this.user = user;
        this.timestamp = timestamp;
    }

    validate() {
        return this.origin && this.destination && this.user;
    }

    getUserPreferences() {
        return this.user.getPreferences();
    }
}

export default RouteRequest;
