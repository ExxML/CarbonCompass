import { useState, useEffect, useCallback } from 'react';

// WMO Weather interpretation codes
const mapWeatherCodeToCondition = (code) => {
  const codes = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Cloudy',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return codes[code] || 'Unknown';
};

export const useWeatherData = (initialLocation = null) => {
  const [weatherData, setWeatherData] = useState({
    location: 'Loading...',
    temperature: 0,
    condition: 'Loading...',
    humidity: 0,
    windSpeed: 0,
    uvIndex: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(initialLocation);

  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }, []);

  const fetchWeatherData = useCallback(async (locationParam = null) => {
    setLoading(true);
    setError(null);

    try {
      let coords = {};
      if (locationParam?.lat && locationParam?.lng) {
        coords = locationParam;
      } else if (location?.lat && location?.lng) {
        coords = location;
      } else {
        try {
          coords = await getCurrentLocation();
        } catch (geoError) {
          console.error('Geolocation failed:', geoError);
          // Fallback to a default location (e.g., Vancouver)
          coords = { lat: 49.2827, lng: -123.1207 };
        }
      }

      const { lat, lng } = coords;
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=uv_index_max&timezone=auto`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch weather from Open-Meteo');

      const data = await response.json();

      // Reverse geocode to get location name (city, province)
      let locationName = 'Current Location';
      try {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          {
            headers: {
              'User-Agent': 'CarbonCompass/1.0'
            }
          }
        );
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.address) {
            // Extract city and province from address data
            const city = geoData.address.city || geoData.address.town || geoData.address.village || 'Unknown City';
            const province = geoData.address.state || geoData.address.region || 'Unknown Province';

            // Format as "City, Province"
            if (city !== 'Unknown City' && province !== 'Unknown Province') {
              locationName = `${city}, ${province}`;
            } else {
              // Fallback to display_name if address parsing fails
              locationName = geoData.display_name ? geoData.display_name.split(',')[0] : 'Unknown Location';
            }
          } else {
            locationName = geoData.display_name ? geoData.display_name.split(',')[0] : 'Unknown Location';
          }
        }
      } catch (e) {
        console.error("Reverse geocoding failed", e);
      }

      const sanitizedData = {
        location: locationName,
        temperature: Math.round(data.current.temperature_2m),
        condition: mapWeatherCodeToCondition(data.current.weather_code),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        uvIndex: data.daily.uv_index_max[0],
        time: undefined,
        timestamp: undefined,
      };

      setWeatherData(sanitizedData);
      setError(null);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message);
      setWeatherData({
        location: 'Weather Unavailable',
        temperature: 0,
        condition: '',
        humidity: 0,
        windSpeed: 0,
        uvIndex: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [location, getCurrentLocation]);

  // Update location and fetch new weather data
  const updateLocation = useCallback(
    (newLocation) => {
      setLocation(newLocation);
      fetchWeatherData(newLocation);
    },
    [fetchWeatherData]
  );

  // Refresh weather data
  const refreshWeather = useCallback(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // Auto-fetch weather data on mount or location change
  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!loading) {
          fetchWeatherData();
        }
      },
      10 * 60 * 1000
    ); // 10 minutes

    return () => clearInterval(interval);
  }, [fetchWeatherData, loading]);

  return {
    weatherData,
    loading,
    error,
    location,
    updateLocation,
    refreshWeather,
    getCurrentLocation,
  };
};
