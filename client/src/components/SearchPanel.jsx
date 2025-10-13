import React, { useState, useEffect, useRef } from 'react';
import { Navigation, X, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useDirections } from '../hooks/useDirections';
import { useResponsive } from '../hooks/useResponsive';

const SearchPanel = ({ isDarkMode = false, onRouteChange, onClearSearch, onRouteSelect }) => {
  // Responsive hook
  const { getPanelWidth, getResponsivePosition, isMobile } = useResponsive();

  // Create dynamic styles for placeholder text that updates with dark mode
  React.useEffect(() => {
    const placeholderColor = isDarkMode ? '#9ca3af' : '#6b7280';
    const styleId = 'search-panel-placeholder-styles';

    // Remove existing style element
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .search-input-origin::placeholder,
      .search-input-destination::placeholder {
        color: ${placeholderColor} !important;
        opacity: 1 !important;
      }
      .search-input-origin::-webkit-input-placeholder,
      .search-input-destination::-webkit-input-placeholder {
        color: ${placeholderColor} !important;
        opacity: 1 !important;
      }
      .search-input-origin::-moz-placeholder,
      .search-input-destination::-moz-placeholder {
        color: ${placeholderColor} !important;
        opacity: 1 !important;
      }
      .search-input-origin:-ms-input-placeholder,
      .search-input-destination:-ms-input-placeholder {
        color: ${placeholderColor} !important;
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [isDarkMode]);

  const [isMinimized, setIsMinimized] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [originPredictions, setOriginPredictions] = useState([]);
  const [destinationPredictions, setDestinationPredictions] = useState([]);
  const [allRoutesData, setAllRoutesData] = useState({});
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Get current location
  const getCurrentLocation = React.useCallback(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return Promise.reject(new Error('Geolocation not supported'));
    }

    return new Promise((resolve, reject) => {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setCurrentLocation(location);
          setIsGettingLocation(false);
          resolve(location);
        },
        (error) => {
          setIsGettingLocation(false);
          let message = 'Location access failed';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out';
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout for better accuracy
          maximumAge: 0, // Always get fresh location, no cache
        }
      );
    });
  }, []);

  // Clear search function
  const clearSearch = React.useCallback(() => {
    setOrigin('');
    setDestination('');
    setOriginPredictions([]);
    setDestinationPredictions([]);
    setAllRoutesData({});
    setIsOriginFocused(false);
    setIsDestinationFocused(false);
    setCurrentLocation(null);
    // Notify parent to clear selected route
    if (onRouteSelect) {
      onRouteSelect(null, null);
    }
  }, [onRouteSelect]);

  // Expose clearSearch function to parent component
  React.useEffect(() => {
    if (onClearSearch) {
      onClearSearch(clearSearch);
    }
  }, [onClearSearch, clearSearch]);

  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const originDebounceRef = useRef(null);
  const destinationDebounceRef = useRef(null);

  const { loading, error, getDirections } = useDirections();
  const placesLib = useMapsLibrary('places');

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

  // Initialize Places AutocompleteService
  const [autocompleteService, setAutocompleteService] = useState(null);

  useEffect(() => {
    if (!placesLib || !placesLib.AutocompleteService) return;
    try {
      const service = new placesLib.AutocompleteService();
      setAutocompleteService(service);
      console.log('AutocompleteService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AutocompleteService:', error);
    }
  }, [placesLib]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (originDebounceRef.current) {
        clearTimeout(originDebounceRef.current);
      }
      if (destinationDebounceRef.current) {
        clearTimeout(destinationDebounceRef.current);
      }
    };
  }, []);

  // Debounced function to fetch predictions
  const fetchOriginPredictions = (value) => {
    if (!value) {
      setOriginPredictions([]);
      return;
    }

    // Check if service is available at call time
    if (!autocompleteService) {
      console.warn('AutocompleteService not ready');
      setOriginPredictions([]);
      return;
    }

    console.log('Fetching origin predictions for:', value);
    autocompleteService.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: 'ca' },
        types: ['establishment', 'geocode'],
      },
      (predictions, status) => {
        console.log('Origin predictions response:', { predictions, status });
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setOriginPredictions(predictions);
        } else {
          console.warn('Origin predictions failed:', status);
          setOriginPredictions([]);
        }
      }
    );
  };

  const fetchDestinationPredictions = (value) => {
    if (!value) {
      setDestinationPredictions([]);
      return;
    }

    // Check if service is available at call time
    if (!autocompleteService) {
      console.warn('AutocompleteService not ready');
      setDestinationPredictions([]);
      return;
    }

    console.log('Fetching destination predictions for:', value);
    autocompleteService.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: 'ca' },
        types: ['establishment', 'geocode'],
      },
      (predictions, status) => {
        console.log('Destination predictions response:', { predictions, status });
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setDestinationPredictions(predictions);
        } else {
          console.warn('Destination predictions failed:', status);
          setDestinationPredictions([]);
        }
      }
    );
  };

  // Handle origin input change with debouncing
  const handleOriginChange = (value) => {
    setOrigin(value);

    // Clear existing timeout
    if (originDebounceRef.current) {
      clearTimeout(originDebounceRef.current);
    }

    // Clear predictions immediately if input is empty
    if (!value) {
      setOriginPredictions([]);
      return;
    }

    // Set new timeout for API call
    originDebounceRef.current = setTimeout(() => {
      fetchOriginPredictions(value);
    }, 500); // 500ms delay
  };

  // Handle destination input change with debouncing
  const handleDestinationChange = (value) => {
    setDestination(value);

    // Clear existing timeout
    if (destinationDebounceRef.current) {
      clearTimeout(destinationDebounceRef.current);
    }

    // Clear predictions immediately if input is empty
    if (!value) {
      setDestinationPredictions([]);
      return;
    }

    // Set new timeout for API call
    destinationDebounceRef.current = setTimeout(() => {
      fetchDestinationPredictions(value);
    }, 500); // 500ms delay
  };

  // Handle origin prediction selection
  const handleOriginSelect = (prediction) => {
    setOrigin(prediction.description);
    setOriginPredictions([]);
    setIsOriginFocused(false);
  };

  // Handle destination prediction selection
  const handleDestinationPredictionSelect = (prediction) => {
    setDestination(prediction.description);
    setDestinationPredictions([]);
    setIsDestinationFocused(false);

    // Add to recent searches
    addToRecentSearches({
      id: prediction.place_id || `pred-${Date.now()}`,
      name: prediction.structured_formatting?.main_text || prediction.description,
      address: prediction.description,
      timestamp: Date.now(),
    });
  };

  // Handle current location selection
  const handleCurrentLocationSelect = async (inputType) => {
    try {
      const location = await getCurrentLocation();
      // Use lat,lng format that Google Maps API recognizes
      const locationCoords = `${location.lat.toFixed(6)},${location.lng.toFixed(6)}`;
      const displayText = `Current Location (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`;

      if (inputType === 'origin') {
        // Store coordinates for API, but show user-friendly text
        setOrigin(locationCoords);
        setOriginPredictions([]);
        setIsOriginFocused(false);
        // Update input display with friendly text
        if (originInputRef.current) {
          originInputRef.current.value = displayText;
        }
      } else {
        setDestination(locationCoords);
        setDestinationPredictions([]);
        setIsDestinationFocused(false);
        // Update input display with friendly text
        if (destinationInputRef.current) {
          destinationInputRef.current.value = displayText;
        }
      }

      // Add to recent searches
      addToRecentSearches({
        id: `current-location-${Date.now()}`,
        name: 'Current Location',
        address: displayText,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Failed to get current location:', error);
      // Could add toast notification here
    }
  };

  // Handle selecting a recent search
  const handleRecentSearchSelect = (search) => {
    if (isOriginFocused) {
      setOrigin(search.address);
      setIsOriginFocused(false);
    } else if (isDestinationFocused) {
      setDestination(search.address);
      setIsDestinationFocused(false);
    }
    // Move selected search to top
    addToRecentSearches(search);
  };

  // Handle getting directions for all transportation modes
  const handleGetDirections = async () => {
    if (!origin || !destination) {
      console.warn('Both origin and destination are required');
      return;
    }

    // Clear previous routes data
    setAllRoutesData({});

    try {
      // Fetch routes for all 4 transportation modes in parallel
      const modes = ['driving', 'transit', 'bicycling', 'walking'];
      const routePromises = modes.map((mode) =>
        getDirections({
          origin,
          destination,
          mode,
          alternatives: false, // Get best route for each mode
          units: 'metric',
        }).catch((err) => {
          console.warn(`Failed to get ${mode} directions:`, err.message);
          return null; // Return null for failed requests
        })
      );

      const responses = await Promise.all(routePromises);

      // Combine all successful responses
      const allRoutes = {};
      let successCount = 0;
      modes.forEach((mode, index) => {
        if (responses[index]) {
          allRoutes[mode] = responses[index];
          successCount++;
        }
      });

      if (successCount === 0) {
        console.error('No routes could be found for any transportation mode');
        setAllRoutesData({});
        return;
      }

      // Store the combined routes data for display
      setAllRoutesData(allRoutes);

      // Pass the combined route data to parent component if callback provided
      if (onRouteChange && Object.keys(allRoutes).length > 0) {
        onRouteChange(allRoutes);
      }
    } catch (err) {
      console.error('Failed to get directions:', err);
    }
  };

  // Users can manually click "Get Directions" button or use Enter key
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
    <div style={{ position: 'fixed', ...getResponsivePosition('left'), zIndex: 9999 }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: isMobile ? '12px' : '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: `${getPanelWidth(384)}px`,
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
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
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
                className="search-input-origin"
                onChange={(e) => handleOriginChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && origin.trim()) {
                    // Clear existing timeout and fetch immediately
                    if (originDebounceRef.current) {
                      clearTimeout(originDebounceRef.current);
                    }
                    fetchOriginPredictions(origin.trim());
                  }
                }}
                onFocus={() => {
                  setIsOriginFocused(true);
                  // Clear routes when user starts a new search
                  setAllRoutesData({});
                }}
                onBlur={() => setTimeout(() => setIsOriginFocused(false), 200)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  outline: 'none',
                  border: 'none',
                  fontSize: '15px',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  fontWeight: '500',
                  fontFamily: 'Roboto, sans-serif',
                }}
              />
              {origin && (
                <button
                  onClick={() => {
                    setOrigin('');
                    setOriginPredictions([]);
                  }}
                  style={{
                    padding: '4px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
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
                border: '2px solid rgba(17, 24, 39, 0.1)',
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
                className="search-input-destination"
                onChange={(e) => handleDestinationChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && destination.trim()) {
                    // Clear existing timeout and fetch immediately
                    if (destinationDebounceRef.current) {
                      clearTimeout(destinationDebounceRef.current);
                    }
                    fetchDestinationPredictions(destination.trim());
                  }
                }}
                onFocus={() => {
                  setIsDestinationFocused(true);
                  // Clear routes when user starts a new search
                  setAllRoutesData({});
                }}
                onBlur={() => setTimeout(() => setIsDestinationFocused(false), 200)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  outline: 'none',
                  border: 'none',
                  fontSize: '15px',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  fontWeight: '500',
                  fontFamily: 'Roboto, sans-serif',
                }}
              />
              {destination && (
                <button
                  onClick={() => {
                    setDestination('');
                    setDestinationPredictions([]);
                  }}
                  style={{
                    padding: '4px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
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
                {loading ? 'Finding All Routes...' : 'Get All Routes'}
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

          {/* Route Summary - All Transportation Modes */}
          {allRoutesData &&
            typeof allRoutesData === 'object' &&
            Object.keys(allRoutesData).length > 0 && (
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <p
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#059669',
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  Routes Found!
                </p>

                {/* Route Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['driving', 'transit', 'bicycling', 'walking'].map((mode) => {
                    const routeData = allRoutesData[mode];
                    const route = routeData?.routes?.[0];

                    const modeConfig = {
                      driving: { icon: '🚗', name: 'Driving', color: '#dc2626' },
                      transit: { icon: '🚌', name: 'Transit', color: '#2563eb' },
                      bicycling: { icon: '🚴', name: 'Biking', color: '#16a34a' },
                      walking: { icon: '🚶', name: 'Walking', color: '#7c3aed' },
                    };

                    const config = modeConfig[mode] || { icon: '🗺️', name: mode, color: '#6b7280' };

                    if (!routeData || !route) {
                      // Show unavailable route
                      return (
                        <div
                          key={mode}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 12px',
                            background: 'rgba(107, 114, 128, 0.1)',
                            borderRadius: '8px',
                            border: `1px solid ${config.color}`,
                            opacity: 0.6,
                            position: 'relative',
                          }}
                        >
                          {/* Left side - Icon */}
                          <div
                            style={{
                              position: 'absolute',
                              left: '12px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ fontSize: '18px', filter: 'grayscale(1)' }}>
                              {config.icon}
                            </span>
                          </div>

                          {/* Center - Transportation mode and details */}
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: isDarkMode ? '#9ca3af' : '#6b7280',
                                fontFamily: 'Roboto, sans-serif',
                              }}
                            >
                              {config.name}
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: isDarkMode ? '#6b7280' : '#9ca3af',
                                fontFamily: 'Roboto, sans-serif',
                              }}
                            >
                              Route not available
                            </div>
                          </div>

                          {/* Right side - N/A */}
                          <div
                            style={{
                              position: 'absolute',
                              right: '12px',
                              textAlign: 'right',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#6b7280',
                                fontFamily: 'Roboto, sans-serif',
                              }}
                            >
                              N/A
                            </div>
                          </div>
                        </div>
                      );
                    }

                    const emissions = route.carbon_emissions;

                    return (
                      <div
                        key={mode}
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                      >
                        {/* Main Route Card */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 12px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            border: `2px solid ${config.color}`,
                            position: 'relative',
                            cursor: 'pointer',
                          }}
                          onClick={() => onRouteSelect && onRouteSelect(mode, routeData)}
                        >
                          {/* Left side - Icon */}
                          <div
                            style={{
                              position: 'absolute',
                              left: '12px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ fontSize: '18px' }}>{config.icon}</span>
                          </div>

                          {/* Center - Transportation mode and details */}
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: isDarkMode ? '#f9fafb' : '#111827',
                                fontFamily: 'Roboto, sans-serif',
                              }}
                            >
                              {config.name}
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: isDarkMode ? '#d1d5db' : '#6b7280',
                                fontFamily: 'Roboto, sans-serif',
                              }}
                            >
                              {route.distance?.text} • {route.duration?.text}
                            </div>
                          </div>

                          {/* Right side - Emissions */}
                          <div
                            style={{
                              position: 'absolute',
                              right: '12px',
                              textAlign: 'right',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: emissions?.emissions_kg === 0 ? '#16a34a' : config.color,
                                fontFamily: 'Roboto, sans-serif',
                              }}
                            >
                              {emissions?.emissions_kg === 0
                                ? '0 kg CO₂'
                                : `${emissions?.emissions_kg || 0} kg CO₂`}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: isDarkMode ? '#9ca3af' : '#6b7280',
                                fontFamily: 'Roboto, sans-serif',
                              }}
                            >
                              emissions
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </div>

        {/* Origin Autocomplete Suggestions */}
        {isOriginFocused && (originPredictions.length > 0 || true) && (
          <div style={{ padding: '0 16px 12px 16px' }}>
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
                  <MapPin
                    style={{
                      width: '14px',
                      height: '14px',
                      color: '#10b981',
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
                    Starting Points
                  </span>
                </div>
              </div>

              {/* Current Location Option */}
              <div
                onClick={() => handleCurrentLocationSelect('origin')}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Navigation
                    style={{
                      width: '16px',
                      height: '16px',
                      color: 'white',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: isDarkMode ? '#f9fafb' : '#111827',
                      fontFamily: 'Roboto, sans-serif',
                      marginBottom: '2px',
                    }}
                  >
                    {isGettingLocation ? 'Getting location...' : 'Current Location'}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      fontFamily: 'Roboto, sans-serif',
                    }}
                  >
                    {currentLocation
                      ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                      : 'Use your current position'}
                  </div>
                </div>
              </div>
              {originPredictions.slice(0, 4).map((prediction, index) => (
                <div
                  key={prediction.place_id}
                  onClick={() => handleOriginSelect(prediction)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderBottom:
                      index < Math.min(originPredictions.length - 1, 3)
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
                      style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0 }}
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
                        {prediction.structured_formatting?.main_text || prediction.description}
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
                        {prediction.structured_formatting?.secondary_text || ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Destination Autocomplete Suggestions */}
        {isDestinationFocused && (destinationPredictions.length > 0 || true) && (
          <div style={{ padding: '0 16px 12px 16px' }}>
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
                  <MapPin
                    style={{
                      width: '14px',
                      height: '14px',
                      color: '#dc2626',
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
                    Destinations
                  </span>
                </div>
              </div>

              {/* Current Location Option */}
              <div
                onClick={() => handleCurrentLocationSelect('destination')}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Navigation
                    style={{
                      width: '16px',
                      height: '16px',
                      color: 'white',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: isDarkMode ? '#f9fafb' : '#111827',
                      fontFamily: 'Roboto, sans-serif',
                      marginBottom: '2px',
                    }}
                  >
                    {isGettingLocation ? 'Getting location...' : 'Current Location'}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      fontFamily: 'Roboto, sans-serif',
                    }}
                  >
                    {currentLocation
                      ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                      : 'Use your current position'}
                  </div>
                </div>
              </div>
              {destinationPredictions.slice(0, 4).map((prediction, index) => (
                <div
                  key={prediction.place_id}
                  onClick={() => handleDestinationPredictionSelect(prediction)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderBottom:
                      index < Math.min(destinationPredictions.length - 1, 3)
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
                      style={{ width: '16px', height: '16px', color: '#dc2626', flexShrink: 0 }}
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
                        {prediction.structured_formatting?.main_text || prediction.description}
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
                        {prediction.structured_formatting?.secondary_text || ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {(isOriginFocused || isDestinationFocused) &&
          recentSearches.length > 0 &&
          originPredictions.length === 0 &&
          destinationPredictions.length === 0 && (
            <div style={{ padding: '0 16px 16px 16px' }}>
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
            </div>
          )}
      </div>
    </div>
  );
};

export default SearchPanel;
