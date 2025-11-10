import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for managing search panel state
 * Handles origin/destination inputs, focus states, and debouncing
 */
export const useSearchState = ({
  fetchOriginPredictions,
  fetchDestinationPredictions,
  clearOriginPredictions,
  clearDestinationPredictions,
  onClearSearch,
}) => {
  // UI State
  const [isMinimized, setIsMinimized] = useState(false);

  // Input State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);

  // Route Data
  const [allRoutesData, setAllRoutesData] = useState({});

  // Refs
  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const originDebounceRef = useRef(null);
  const destinationDebounceRef = useRef(null);

  // Clear search
  const clearSearch = useCallback(() => {
    setOrigin('');
    setDestination('');
    setAllRoutesData({});
    clearOriginPredictions();
    clearDestinationPredictions();

    if (originInputRef.current) {
      originInputRef.current.focus();
    }

    if (onClearSearch) {
      onClearSearch();
    }
  }, [clearOriginPredictions, clearDestinationPredictions, onClearSearch]);

  // Handle origin input change
  const handleOriginChange = useCallback(
    (value) => {
      setOrigin(value);
      clearOriginPredictions();

      if (originDebounceRef.current) {
        clearTimeout(originDebounceRef.current);
      }

      if (value.trim() === '') {
        return;
      }

      originDebounceRef.current = setTimeout(() => {
        fetchOriginPredictions(value);
      }, 300);
    },
    [fetchOriginPredictions, clearOriginPredictions]
  );

  // Handle destination input change
  const handleDestinationChange = useCallback(
    (value) => {
      setDestination(value);
      clearDestinationPredictions();

      if (destinationDebounceRef.current) {
        clearTimeout(destinationDebounceRef.current);
      }

      if (value.trim() === '') {
        return;
      }

      destinationDebounceRef.current = setTimeout(() => {
        fetchDestinationPredictions(value);
      }, 300);
    },
    [fetchDestinationPredictions, clearDestinationPredictions]
  );

  // Handle origin selection from predictions
  const handleOriginSelect = useCallback(
    (prediction) => {
      setOrigin(prediction.description);
      clearOriginPredictions();
      setIsOriginFocused(false);
    },
    [clearOriginPredictions]
  );

  // Handle destination selection from predictions
  const handleDestinationSelect = useCallback(
    (prediction) => {
      setDestination(prediction.description);
      clearDestinationPredictions();
      setIsDestinationFocused(false);
    },
    [clearDestinationPredictions]
  );

  // Handle current location selection
  const handleCurrentLocationSelect = useCallback(
    async (inputType, getCurrentLocation) => {
      try {
        const location = await getCurrentLocation();
        const displayText = `Current Location (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`;

        if (inputType === 'origin') {
          setOrigin(displayText);
          clearOriginPredictions();
          setIsOriginFocused(false);
        } else if (inputType === 'destination') {
          setDestination(displayText);
          clearDestinationPredictions();
          setIsDestinationFocused(false);
        }
      } catch (error) {
        console.error('Failed to get current location:', error);
      }
    },
    [clearOriginPredictions, clearDestinationPredictions]
  );

  // Handle recent search selection
  const handleRecentSearchSelect = useCallback(
    (search, isOriginFocusedParam, isDestinationFocusedParam) => {
      const searchValue = search.address || search.name;

      // Set value to whichever input is focused
      if (isOriginFocusedParam) {
        setOrigin(searchValue);
        clearOriginPredictions();
        setIsOriginFocused(false);
      } else if (isDestinationFocusedParam) {
        setDestination(searchValue);
        clearDestinationPredictions();
        setIsDestinationFocused(false);
      }
    },
    [clearOriginPredictions, clearDestinationPredictions]
  );

  return {
    // State
    isMinimized,
    origin,
    destination,
    isOriginFocused,
    isDestinationFocused,
    allRoutesData,

    // Refs
    originInputRef,
    destinationInputRef,
    originDebounceRef,
    destinationDebounceRef,

    // Setters
    setIsMinimized,
    setOrigin,
    setDestination,
    setIsOriginFocused,
    setIsDestinationFocused,
    setAllRoutesData,

    // Handlers
    clearSearch,
    handleOriginChange,
    handleDestinationChange,
    handleOriginSelect,
    handleDestinationSelect,
    handleCurrentLocationSelect,
    handleRecentSearchSelect,
  };
};
