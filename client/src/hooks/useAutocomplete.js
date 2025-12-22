/**
 * Autocomplete Hook
 * Single Responsibility: Handle autocomplete state and debounced predictions fetching
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { fetchPlacePredictions } from '../services/autocompleteService';
import { API_CONFIG } from '../constants';

export const useAutocomplete = (autocompleteService) => {
  const [predictions, setPredictions] = useState([]);
  const debounceRef = useRef(null);

  /**
   * Fetch predictions with debouncing
   */
  const fetchPredictions = useCallback(
    (value) => {
      if (!value) {
        setPredictions([]);
        return;
      }

      if (!autocompleteService) {
        console.warn('AutocompleteService not ready');
        setPredictions([]);
        return;
      }

      fetchPlacePredictions(autocompleteService, value)
        .then((results) => setPredictions(results))
        .catch((error) => {
          console.error('Failed to fetch predictions:', error);
          setPredictions([]);
        });
    },
    [autocompleteService]
  );

  /**
   * Handle input change with debouncing
   */
  const handleInputChange = useCallback(
    (value) => {
      // Clear existing timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Clear predictions immediately if input is empty
      if (!value) {
        setPredictions([]);
        return;
      }

      // Set new timeout for API call
      debounceRef.current = setTimeout(() => {
        fetchPredictions(value);
      }, API_CONFIG.DEBOUNCE_DELAY);
    },
    [fetchPredictions]
  );

  /**
   * Clear predictions
   */
  const clearPredictions = useCallback(() => {
    setPredictions([]);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    predictions,
    handleInputChange,
    clearPredictions,
    fetchPredictions,
  };
};
