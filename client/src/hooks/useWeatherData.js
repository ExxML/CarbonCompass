import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

export const useWeatherData = (initialLocation = null) => {
  // Initialize with safe default data to prevent null errors
  const [weatherData, setWeatherData] = useState({
    location: 'Loading...',
    temperature: 0,
    condition: 'Partly Cloudy',
    humidity: 0,
    windSpeed: 0,
    uvIndex: 0,
  });
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(initialLocation);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        }
      );
    });
  }, []);

  // Fetch weather data
  const fetchWeatherData = useCallback(
    async (locationParam = null) => {
      setLoading(true);
      setError(null);

      try {
        let weatherParams = {};

        if (locationParam) {
          // Use provided location
          if (typeof locationParam === 'string') {
            weatherParams.location = locationParam;
          } else if (locationParam.lat && locationParam.lng) {
            weatherParams.lat = locationParam.lat;
            weatherParams.lng = locationParam.lng;
          }
        } else if (location) {
          // Use stored location
          if (typeof location === 'string') {
            weatherParams.location = location;
          } else if (location.lat && location.lng) {
            weatherParams.lat = location.lat;
            weatherParams.lng = location.lng;
          }
        } else {
          // Try to get current location
          try {
            const currentLocation = await getCurrentLocation();
            weatherParams.lat = currentLocation.lat;
            weatherParams.lng = currentLocation.lng;
          } catch {
            // Fallback to default location if geolocation fails
            weatherParams.location = 'Vancouver, BC';
          }
        }

        const response = await apiService.getWeather(weatherParams);

        if (response.success && response.data) {
          // Validate and sanitize the response data
          const sanitizedData = {
            location: response.data.location || 'Unknown Location',
            temperature: response.data.temperature ?? 18,
            condition: response.data.condition || 'Partly Cloudy',
            humidity: response.data.humidity ?? 65,
            windSpeed: response.data.windSpeed ?? 12,
            uvIndex: response.data.uvIndex ?? 3,
            feelsLike: response.data.feelsLike ?? response.data.temperature ?? 18,
            visibility: response.data.visibility ?? 10,
            pressure: response.data.pressure ?? 1013,
          };
          setWeatherData(sanitizedData);
          setError(null);
        } else {
          throw new Error(response.error || 'Failed to fetch weather data');
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(err.message);
        // Set fallback weather data
        setWeatherData({
          location: 'Vancouver, BC',
          temperature: 18,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          uvIndex: 3,
          feelsLike: 20,
          visibility: 10,
          pressure: 1013,
        });
      } finally {
        setLoading(false);
      }
    },
    [location, getCurrentLocation]
  );

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
