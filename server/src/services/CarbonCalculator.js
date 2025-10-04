class CarbonCalculator {
    calculate(route, transportMode) {
        // Placeholder: implement mode-specific carbon calculation
        let factor = transportMode === 'car' ? 1 : 0.5;
        return route.distance * factor;
    }

    compare(route1, route2) {
        return route1.carbonFootprint - route2.carbonFootprint;
    }
}

export default CarbonCalculator;
