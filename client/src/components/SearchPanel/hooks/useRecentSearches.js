import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing recent searches in localStorage
 */
export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');

    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    } else {
      // Default sample searches
      const sampleSearches = [
        {
          id: Date.now(),
          name: 'Vancouver Convention Centre',
          address: '1055 Canada Pl, Vancouver, BC',
        },
        {
          id: Date.now() + 1,
          name: 'Stanley Park',
          address: 'Vancouver, BC',
        },
        {
          id: Date.now() + 2,
          name: 'Granville Island',
          address: '1661 Duranleau St, Vancouver, BC',
        },
      ];
      setRecentSearches(sampleSearches);
      localStorage.setItem('recentSearches', JSON.stringify(sampleSearches));
    }
  }, []);

  const addToRecentSearches = useCallback(
    (search) => {
      // Filter out duplicates based on both name and address to prevent duplicates
      const updatedSearches = [
        search,
        ...recentSearches.filter(
          (s) =>
            s.name.toLowerCase() !== search.name.toLowerCase() &&
            s.address.toLowerCase() !== search.address.toLowerCase()
        ),
      ].slice(0, 10); // Keep only 10 most recent

      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    },
    [recentSearches]
  );

  return {
    recentSearches,
    addToRecentSearches,
  };
};
