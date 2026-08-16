import { useState, useCallback, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

/**
 * Maps a Places suggestion to the prediction shape consumed by the search panel
 * @param {google.maps.places.AutocompleteSuggestion} suggestion
 */
const toPrediction = ({ placePrediction }) => ({
  place_id: placePrediction.placeId,
  description: placePrediction.text?.toString() ?? '',
  structured_formatting: {
    main_text: placePrediction.mainText?.toString() ?? '',
    secondary_text: placePrediction.secondaryText?.toString() ?? '',
  },
});

/**
 * Custom hook for managing Google Places autocomplete functionality
 * Handles prediction fetching for both origin and destination inputs
 */
export const useAutocomplete = () => {
  const [originPredictions, setOriginPredictions] = useState([]);
  const [destinationPredictions, setDestinationPredictions] = useState([]);

  // Loads asynchronously; predictions can only be fetched once it is available
  const placesLib = useMapsLibrary('places');

  // Billing sessions, kept separate so each input is charged as its own session
  const originSessionRef = useRef(null);
  const destinationSessionRef = useRef(null);

  // Returns the active session token, starting a new session when none is open
  const getSessionToken = useCallback(
    (sessionRef) => {
      if (!placesLib) return undefined;

      if (!sessionRef.current) {
        sessionRef.current = new placesLib.AutocompleteSessionToken();
      }

      return sessionRef.current;
    },
    [placesLib]
  );

  const fetchPredictions = useCallback(
    async (value, sessionRef, setPredictions, label) => {
      try {
        const { suggestions } = await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions(
          {
            input: value,
            sessionToken: getSessionToken(sessionRef),
            includedPrimaryTypes: ['geocode', 'establishment'],
          }
        );

        setPredictions(suggestions.filter((s) => s.placePrediction).map(toPrediction));
      } catch (error) {
        console.warn(`${label} prediction request failed:`, error);
        setPredictions([]);
      }
    },
    [placesLib, getSessionToken]
  );

  // Clear predictions
  const clearOriginPredictions = useCallback(() => {
    setOriginPredictions([]);
  }, []);

  const clearDestinationPredictions = useCallback(() => {
    setDestinationPredictions([]);
  }, []);

  // End the current billing session, so the next keystroke starts a new one
  const endOriginSession = useCallback(() => {
    originSessionRef.current = null;
  }, []);

  const endDestinationSession = useCallback(() => {
    destinationSessionRef.current = null;
  }, []);

  // Fetch origin predictions
  const fetchOriginPredictions = useCallback(
    (value) => {
      if (!value || value.trim() === '' || !placesLib) {
        setOriginPredictions([]);
        return;
      }

      fetchPredictions(value, originSessionRef, setOriginPredictions, 'Origin');
    },
    [placesLib, fetchPredictions]
  );

  // Fetch destination predictions
  const fetchDestinationPredictions = useCallback(
    (value) => {
      if (!value || value.trim() === '' || !placesLib) {
        setDestinationPredictions([]);
        return;
      }

      fetchPredictions(value, destinationSessionRef, setDestinationPredictions, 'Destination');
    },
    [placesLib, fetchPredictions]
  );

  return {
    originPredictions,
    destinationPredictions,
    fetchOriginPredictions,
    fetchDestinationPredictions,
    clearOriginPredictions,
    clearDestinationPredictions,
    endOriginSession,
    endDestinationSession,
  };
};
