import express from "express";
const router = express.Router();

/**
 * Get weather information for a location
 * Using Google Maps Geocoding API + Weather data
 */
router.get("/", async (req, res) => {
  try {
    const { location, lat, lng } = req.query;

    if (!location && (!lat || !lng)) {
      return res.status(400).json({
        error: "Location name or coordinates (lat, lng) are required",
      });
    }

    // For now, we'll use a mock response since Google doesn't have a dedicated weather API
    // In production, you would integrate with a weather service like OpenWeatherMap, AccuWeather, etc.

    let weatherLocation = location;
    let coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };

    // If only location name is provided, we could geocode it first
    if (location && !lat && !lng) {
      // Mock coordinates for common cities - in production, use Google Geocoding API
      const cityCoordinates = {
        vancouver: { lat: 49.2827, lng: -123.1207 },
        toronto: { lat: 43.6532, lng: -79.3832 },
        montreal: { lat: 45.5017, lng: -73.5673 },
        calgary: { lat: 51.0447, lng: -114.0719 },
        ottawa: { lat: 45.4215, lng: -75.6972 },
      };

      const cityKey = location.toLowerCase().split(",")[0].trim();
      coordinates = cityCoordinates[cityKey] || {
        lat: 49.2827,
        lng: -123.1207,
      };
      weatherLocation = location;
    }

    // Mock weather data based on location
    // In production, replace this with actual weather API calls
    const mockWeatherData = generateMockWeather(coordinates, weatherLocation);

    res.json({
      success: true,
      data: mockWeatherData,
    });
  } catch (error) {
    console.error("Weather API error:", error);
    res.status(500).json({
      error: "Failed to fetch weather data",
      message: error.message,
    });
  }
});

/**
 * Generate mock weather data based on coordinates
 * In production, replace with actual weather API integration
 */
function generateMockWeather(coordinates, location) {
  const { lat, lng } = coordinates;

  // Mock weather based on geographical location and season
  const isNorthern = lat > 0;
  const isWinter = new Date().getMonth() >= 11 || new Date().getMonth() <= 2;
  const isCoastal = Math.abs(lng) > 100; // Rough approximation

  // Base temperature calculation
  let baseTemp = isNorthern ? (isWinter ? 5 : 20) : isWinter ? 25 : 35;

  // Adjust for coastal areas
  if (isCoastal) {
    baseTemp += isWinter ? 3 : -2; // Coastal areas are more moderate
  }

  // Add some randomness
  const temperature = Math.round(baseTemp + (Math.random() - 0.5) * 10);

  // Weather conditions based on location and season
  const conditions = isWinter
    ? ["Cloudy", "Partly Cloudy", "Rainy", "Overcast"]
    : ["Sunny", "Partly Cloudy", "Clear", "Cloudy"];

  const condition = conditions[Math.floor(Math.random() * conditions.length)];

  return {
    location:
      location ||
      `${coordinates.lat.toFixed(2)}, ${coordinates.lng.toFixed(2)}`,
    temperature,
    condition,
    humidity: Math.round(45 + Math.random() * 40), // 45-85%
    windSpeed: Math.round(5 + Math.random() * 20), // 5-25 km/h
    uvIndex: Math.round(1 + Math.random() * 10), // 1-11
    feelsLike: Math.round(temperature + (Math.random() - 0.5) * 6),
    visibility: Math.round(8 + Math.random() * 7), // 8-15 km
    pressure: Math.round(1000 + Math.random() * 40), // 1000-1040 hPa
    timestamp: new Date().toISOString(),
    coordinates,
  };
}

export default router;
