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
   * Fetch directions between two points
   */
  const getDirections = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getDirections(params);

      if (response.success) {
        setDirectionsData(response.data);
        return response.data;
      } else {
        throw new Error('Failed to get directions');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching directions:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
