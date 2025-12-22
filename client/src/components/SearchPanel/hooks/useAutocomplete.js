import { useState, useEffect, useCallback } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

/**
 * Custom hook for managing Google Places autocomplete functionality
 * Handles prediction fetching for both origin and destination inputs
 */
export const useAutocomplete = () => {
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [originPredictions, setOriginPredictions] = useState([]);
  const [destinationPredictions, setDestinationPredictions] = useState([]);

  const placesLib = useMapsLibrary('places');

  // Initialize autocomplete service
  useEffect(() => {
    if (!placesLib) return;

    const service = new placesLib.AutocompleteService();
    setAutocompleteService(service);
  }, [placesLib]);

  // Clear predictions
  const clearOriginPredictions = useCallback(() => {
    setOriginPredictions([]);
  }, []);

  const clearDestinationPredictions = useCallback(() => {
    setDestinationPredictions([]);
  }, []);

  // Fetch origin predictions
  const fetchOriginPredictions = useCallback(
    (value) => {
      if (!value || value.trim() === '' || !autocompleteService) {
        setOriginPredictions([]);
        return;
      }

      autocompleteService.getPlacePredictions(
        {
          input: value,
          types: ['geocode', 'establishment'],
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setOriginPredictions(predictions);
          } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setOriginPredictions([]);
          } else {
            console.warn('Origin prediction request failed:', status);
            setOriginPredictions([]);
          }
        }
      );
    },
    [autocompleteService]
  );

  // Fetch destination predictions
  const fetchDestinationPredictions = useCallback(
    (value) => {
      if (!value || value.trim() === '' || !autocompleteService) {
        setDestinationPredictions([]);
        return;
      }

      autocompleteService.getPlacePredictions(
        {
          input: value,
          types: ['geocode', 'establishment'],
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setDestinationPredictions(predictions);
          } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setDestinationPredictions([]);
          } else {
            console.warn('Destination prediction request failed:', status);
            setDestinationPredictions([]);
          }
        }
      );
    },
    [autocompleteService]
  );

  return {
    originPredictions,
    destinationPredictions,
    fetchOriginPredictions,
    fetchDestinationPredictions,
    clearOriginPredictions,
    clearDestinationPredictions,
    autocompleteService,
  };
};
