import React, { useState, useEffect, useRef } from 'react';
import { Navigation, X, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useDirections } from '../hooks/useDirections';

const SearchPanel = ({ isDarkMode = false, onRouteChange }) => {
  console.log('SearchPanel is rendering...');
  const [isMinimized, setIsMinimized] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const originAutocompleteRef = useRef(null);
  const destinationAutocompleteRef = useRef(null);

  const { directionsData, loading, error, getDirections, clearDirections, getBestRoute } =
    useDirections();

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    } else {
      // Initialize with some sample data for demonstration
      const sampleSearches = [
        {
          id: 'sample-1',
          name: 'Vancouver Convention Centre',
          address: '1055 Canada Pl, Vancouver, BC V6C 0C3, Canada',
          timestamp: Date.now() - 3600000, // 1 hour ago
        },
        {
          id: 'sample-2',
          name: 'Stanley Park',
          address: 'Vancouver, BC, Canada',
          timestamp: Date.now() - 7200000, // 2 hours ago
        },
        {
          id: 'sample-3',
          name: 'Granville Island',
          address: '1661 Duranleau St, Vancouver, BC V6H 3S3, Canada',
          timestamp: Date.now() - 10800000, // 3 hours ago
        },
      ];
      setRecentSearches(sampleSearches);
      localStorage.setItem('recentSearches', JSON.stringify(sampleSearches));
    }
  }, []);

  // Add search to recent searches and save to localStorage
  const addToRecentSearches = React.useCallback(
    (newSearch) => {
      const updatedSearches = [
        newSearch,
        ...recentSearches.filter((search) => search.id !== newSearch.id),
      ].slice(0, 3); // Keep only the 3 most recent

      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    },
    [recentSearches]
  );

  // Initialize Google Places Autocomplete for Origin
  useEffect(() => {
    if (!window.google || !originInputRef.current) return;

    const originAutocomplete = new window.google.maps.places.Autocomplete(originInputRef.current, {
      types: ['establishment', 'geocode'],
      componentRestrictions: { country: 'ca' }, // Restrict to Canada for Vancouver area
    });

    originAutocompleteRef.current = originAutocomplete;

    originAutocomplete.addListener('place_changed', () => {
      const place = originAutocomplete.getPlace();
      if (place.place_id && place.name) {
        setOrigin(place.formatted_address || place.name);
        setIsOriginFocused(false);
      }
    });

    return () => {
      if (window.google && originAutocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(originAutocompleteRef.current);
      }
    };
  }, []);

  // Initialize Google Places Autocomplete for Destination
  useEffect(() => {
    if (!window.google || !destinationInputRef.current) return;

    const destinationAutocomplete = new window.google.maps.places.Autocomplete(
      destinationInputRef.current,
      {
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'ca' }, // Restrict to Canada for Vancouver area
      }
    );

    destinationAutocompleteRef.current = destinationAutocomplete;

    destinationAutocomplete.addListener('place_changed', () => {
      const place = destinationAutocomplete.getPlace();
      if (place.place_id && place.name) {
        const newSearch = {
          id: place.place_id,
          name: place.name,
          address: place.formatted_address || place.vicinity || '',
          timestamp: Date.now(),
        };
        addToRecentSearches(newSearch);
        setDestination(place.formatted_address || place.name);
        setIsDestinationFocused(false);
      }
    });

    return () => {
      if (window.google && destinationAutocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(destinationAutocompleteRef.current);
      }
    };
  }, [addToRecentSearches]);

  // Handle selecting a recent search
  const handleRecentSearchSelect = (search) => {
    setDestination(search.name);
    setIsDestinationFocused(false);
    // Move selected search to top
    addToRecentSearches(search);
  };

  // Handle getting directions
  const handleGetDirections = async () => {
    if (!origin || !destination) {
      console.warn('Both origin and destination are required');
      return;
    }

    try {
      const directionsResponse = await getDirections({
        origin,
        destination,
        mode: 'driving', // Default to driving as requested
        alternatives: true,
        units: 'metric',
      });

      // Pass the route data to parent component if callback provided
      if (onRouteChange && directionsResponse) {
        onRouteChange(directionsResponse);
      }
    } catch (err) {
      console.error('Failed to get directions:', err);
    }
  };

  // Auto-trigger directions when both origin and destination are set
  useEffect(() => {
    if (origin && destination && !loading) {
      handleGetDirections();
    }
  }, [origin, destination, loading]);

  if (isMinimized) {
    return (
      <div style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 9999 }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            padding: '12px',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease',
          }}
          onClick={() => setIsMinimized(false)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
            <Navigation style={{ width: '20px', height: '20px', color: '#2563eb' }} />
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: isDarkMode ? '#f9fafb' : '#374151',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Directions
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 9999 }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: '384px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation style={{ width: '20px', height: '20px', color: '#2563eb' }} />
            <span
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Directions
            </span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              padding: '4px',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            <X
              style={{ width: '16px', height: '16px', color: isDarkMode ? '#d1d5db' : '#6b7280' }}
            />
          </button>
        </div>

        {/* Search Input */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Origin Input */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.5)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  border: '3px solid #10b981',
                  borderRadius: '50%',
                  flexShrink: 0,
                }}
              />
              <input
                ref={originInputRef}
                type="text"
                placeholder="Choose starting point"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                onFocus={() => setIsOriginFocused(true)}
                onBlur={() => setTimeout(() => setIsOriginFocused(false), 150)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  outline: 'none',
                  border: 'none',
                  fontSize: '16px',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  fontWeight: '400',
                  fontFamily: 'Roboto, sans-serif',
                }}
              />
              {origin && (
                <button
                  onClick={() => setOrigin('')}
                  style={{
                    padding: '4px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
                >
                  <X
                    style={{
                      width: '16px',
                      height: '16px',
                      color: isDarkMode ? '#d1d5db' : '#9ca3af',
                    }}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Arrow between inputs */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '-6px 0' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                padding: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <ArrowRight
                style={{
                  width: '16px',
                  height: '16px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  transform: 'rotate(90deg)',
                }}
              />
            </div>
          </div>

          {/* Destination Input */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.5)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg
                style={{ width: '20px', height: '20px', color: '#dc2626', flexShrink: 0 }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                ref={destinationInputRef}
                type="text"
                placeholder="Where do you want to go?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setIsDestinationFocused(true)}
                onBlur={() => setTimeout(() => setIsDestinationFocused(false), 150)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  outline: 'none',
                  border: 'none',
                  fontSize: '16px',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  fontWeight: '400',
                  fontFamily: 'Roboto, sans-serif',
                }}
              />
              {destination && (
                <button
                  onClick={() => setDestination('')}
                  style={{
                    padding: '4px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
                >
                  <X
                    style={{
                      width: '16px',
                      height: '16px',
                      color: isDarkMode ? '#d1d5db' : '#9ca3af',
                    }}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Get Directions Button */}
          {origin && destination && (
            <button
              onClick={handleGetDirections}
              disabled={loading}
              style={{
                padding: '12px 16px',
                background: loading ? 'rgba(37, 99, 235, 0.5)' : 'rgba(37, 99, 235, 0.8)',
                borderRadius: '12px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Navigation
                style={{
                  width: '16px',
                  height: '16px',
                  color: 'white',
                }}
              />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                {loading ? 'Getting Directions...' : 'Get Directions'}
              </span>
            </button>
          )}

          {/* Error Display */}
          {error && (
            <div
              style={{
                padding: '12px',
                background: 'rgba(220, 38, 38, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(220, 38, 38, 0.3)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#dc2626',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Route Summary */}
          {directionsData && getBestRoute() && (
            <div
              style={{
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <p
                style={{
                  margin: '0 0 4px 0',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#059669',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Route Found!
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                {getBestRoute().distance?.text} • {getBestRoute().duration?.text}
              </p>
            </div>
          )}

          {/* Recent Searches */}
          {(isOriginFocused || isDestinationFocused) && recentSearches.length > 0 && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '12px 16px 8px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock
                    style={{
                      width: '14px',
                      height: '14px',
                      color: isDarkMode ? '#d1d5db' : '#6b7280',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: isDarkMode ? '#d1d5db' : '#6b7280',
                      fontFamily: 'Roboto, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Recent Searches
                  </span>
                </div>
              </div>
              {recentSearches.slice(0, 3).map((search, index) => (
                <div
                  key={search.id}
                  onClick={() => handleRecentSearchSelect(search)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderBottom:
                      index < recentSearches.length - 1 && index < 2
                        ? '1px solid rgba(255, 255, 255, 0.05)'
                        : 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin
                      style={{ width: '16px', height: '16px', color: '#2563eb', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: isDarkMode ? '#f9fafb' : '#111827',
                          fontFamily: 'Roboto, sans-serif',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {search.name}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: isDarkMode ? '#d1d5db' : '#6b7280',
                          fontFamily: 'Roboto, sans-serif',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: '2px',
                        }}
                      >
                        {search.address}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
