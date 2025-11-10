/**
 * Recent Searches Hook
 * Single Responsibility: Manage recent searches with local storage
 */

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, API_CONFIG } from '../constants';

/**
 * Sample searches for initial state
 */
const SAMPLE_SEARCHES = [
  {
    id: 'sample-1',
    name: 'Vancouver Convention Centre',
    address: '1055 Canada Pl, Vancouver, BC V6C 0C3, Canada',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'sample-2',
    name: 'Stanley Park',
    address: 'Vancouver, BC, Canada',
    timestamp: Date.now() - 7200000,
  },
  {
    id: 'sample-3',
    name: 'Granville Island',
    address: '1661 Duranleau St, Vancouver, BC V6H 3S3, Canada',
    timestamp: Date.now() - 10800000,
  },
];

/**
 * Custom hook for managing recent searches
 * @returns {Object} - { recentSearches, addSearch, clearSearches }
 */
export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useLocalStorage(
    STORAGE_KEYS.RECENT_SEARCHES,
    SAMPLE_SEARCHES
  );

  /**
   * Adds a new search to recent searches
   * Removes duplicates and keeps only the most recent items
   */
  const addSearch = useCallback(
    (newSearch) => {
      const updatedSearches = [
        {
          ...newSearch,
          timestamp: Date.now(),
        },
        ...recentSearches.filter((search) => search.id !== newSearch.id),
      ].slice(0, API_CONFIG.RECENT_SEARCHES_LIMIT);

      setRecentSearches(updatedSearches);
    },
    [recentSearches, setRecentSearches]
  );

  /**
   * Clears all recent searches
   */
  const clearSearches = useCallback(() => {
    setRecentSearches([]);
  }, [setRecentSearches]);

  /**
   * Creates a search object from a prediction
   */
  const createSearchFromPrediction = useCallback((prediction) => {
    return {
      id: prediction.place_id || `pred-${Date.now()}`,
      name: prediction.structured_formatting?.main_text || prediction.description,
      address: prediction.description,
      timestamp: Date.now(),
    };
  }, []);

  /**
   * Creates a search object from current location
   */
  const createSearchFromLocation = useCallback((location, displayText) => {
    return {
      id: `current-location-${Date.now()}`,
      name: 'Current Location',
      address: displayText,
      timestamp: Date.now(),
    };
  }, []);

  return {
    recentSearches,
    addSearch,
    clearSearches,
    createSearchFromPrediction,
    createSearchFromLocation,
  };
};
