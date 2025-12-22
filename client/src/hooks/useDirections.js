import { useState, useCallback } from 'react';
import { apiService } from '../services/apiService';

/**
 * Custom hook for managing directions data
 */
export const useDirections = () => {
  const [directionsData, setDirectionsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch directions using Google Maps Directions Service
   */
  const getDirectionsFromGoogle = useCallback(async (params) => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error('Google Maps API not loaded'));
        return;
      }

      const directionsService = new window.google.maps.DirectionsService();
      const travelMode =
        {
          driving: window.google.maps.TravelMode.DRIVING,
          walking: window.google.maps.TravelMode.WALKING,
          bicycling: window.google.maps.TravelMode.BICYCLING,
          transit: window.google.maps.TravelMode.TRANSIT,
        }[params.mode] || window.google.maps.TravelMode.DRIVING;

      directionsService.route(
        {
          origin: params.origin,
          destination: params.destination,
          travelMode: travelMode,
          unitSystem:
            params.units === 'metric'
              ? window.google.maps.UnitSystem.METRIC
              : window.google.maps.UnitSystem.IMPERIAL,
          avoidHighways: params.avoid?.includes('highways'),
          avoidTolls: params.avoid?.includes('tolls'),
          avoidFerries: params.avoid?.includes('ferries'),
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        }
      );
    });
  }, []);

  /**
   * Fetch directions between two points
   */
  const getDirections = useCallback(
    async (params) => {
      setLoading(true);
      setError(null);

      try {
        // Try backend first, fallback to Google Maps API
        let response;
        try {
          response = await apiService.getDirections(params);
          if (response.success) {
            setDirectionsData(response.data);
            return response.data;
          }
          // Backend returned unsuccessful response, trigger fallback
          throw new Error(`Backend returned: ${response.message || 'Unknown error'}`);
        } catch (backendError) {
          console.warn(
            'Backend unavailable, using Google Maps API directly:',
            backendError.message
          );

          // Fallback to Google Maps API
          const directResult = await getDirectionsFromGoogle(params);
          setDirectionsData(directResult);
          return directResult;
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching directions:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getDirectionsFromGoogle]
  );

  /**
   * Clear directions data
   */
  const clearDirections = useCallback(() => {
    setDirectionsData(null);
    setError(null);
  }, []);

  /**
   * Get the best route (first route by default)
   */
  const getBestRoute = useCallback(() => {
    return directionsData?.routes?.[0] || null;
  }, [directionsData]);

  /**
   * Get all routes with their carbon emissions
   */
  const getRoutesWithEmissions = useCallback(() => {
    return directionsData?.routes || [];
  }, [directionsData]);

  /**
   * Get total distance of the best route
   */
  const getTotalDistance = useCallback(() => {
    const bestRoute = getBestRoute();
    return bestRoute?.distance || null;
  }, [getBestRoute]);

  /**
   * Get total duration of the best route
   */
  const getTotalDuration = useCallback(() => {
    const bestRoute = getBestRoute();
    return bestRoute?.duration || null;
  }, [getBestRoute]);

  /**
   * Get carbon emissions of the best route
   */
  const getCarbonEmissions = useCallback(() => {
    const bestRoute = getBestRoute();
    return bestRoute?.carbon_emissions || null;
  }, [getBestRoute]);

  return {
    directionsData,
    loading,
    error,
    getDirections,
    clearDirections,
    getBestRoute,
    getRoutesWithEmissions,
    getTotalDistance,
    getTotalDuration,
    getCarbonEmissions,
  };
};
