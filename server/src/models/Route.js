class Route {
    constructor(path, distance, duration, carbonFootprint) {
        this.path = path; // array of locations
        this.distance = distance;
        this.duration = duration;
        this.carbonFootprint = carbonFootprint;
    }

    getSummary() {
        return {
            path: this.path,
            distance: this.distance,
            duration: this.duration,
            carbonFootprint: this.carbonFootprint
        };
    }

    getCO2Impact() {
        return this.carbonFootprint;
    }
}

export default Route;
