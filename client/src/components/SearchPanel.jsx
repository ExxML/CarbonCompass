import React, { useState, useEffect, useRef } from 'react';
import { Navigation, X, Clock, MapPin } from 'lucide-react';

const SearchPanel = ({ isDarkMode = false }) => {
  console.log('SearchPanel is rendering...');
  const [isMinimized, setIsMinimized] = useState(false);
  const [destination, setDestination] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

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

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment', 'geocode'],
      componentRestrictions: { country: 'ca' }, // Restrict to Canada for Vancouver area
    });

    autocompleteRef.current = autocomplete;

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.place_id && place.name) {
        const newSearch = {
          id: place.place_id,
          name: place.name,
          address: place.formatted_address || place.vicinity || '',
          timestamp: Date.now(),
        };
        addToRecentSearches(newSearch);
        setDestination(place.name);
        setIsInputFocused(false);
      }
    });

    return () => {
      if (window.google && autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
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

  // Handle selecting a recent search
  const handleRecentSearchSelect = (search) => {
    setDestination(search.name);
    setIsInputFocused(false);
    // Move selected search to top
    addToRecentSearches(search);
  };

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
                style={{ width: '20px', height: '20px', color: '#2563eb', flexShrink: 0 }}
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
                ref={inputRef}
                type="text"
                placeholder="Where do you want to go?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 150)} // Delay to allow click on recent items
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

          {/* Recent Searches */}
          {isInputFocused && recentSearches.length > 0 && (
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
                      {search.address && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: isDarkMode ? '#d1d5db' : '#6b7280',
                            fontFamily: 'Roboto, sans-serif',
                            marginTop: '2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {search.address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          <div style={{ paddingTop: '8px' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                fontFamily: 'Roboto, sans-serif',
                transition: 'all 0.2s ease',
                width: '100%',
                backdropFilter: 'blur(10px)',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#1d4ed8';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Navigation style={{ width: '18px', height: '18px' }} />
              Find Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
