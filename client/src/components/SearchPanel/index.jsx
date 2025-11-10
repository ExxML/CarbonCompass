import { useEffect } from 'react';
import { Navigation, X } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';
import { useDirections } from '../../hooks/useDirections';
import { injectPlaceholderStyles, removePlaceholderStyles } from './utils/styleUtils';
import { useGeolocation } from './hooks/useGeolocation';
import { useRecentSearches } from './hooks/useRecentSearches';
import { useAutocomplete } from './hooks/useAutocomplete';
import { useSearchState } from './hooks/useSearchState';
import MinimizedView from './components/MinimizedView';
import LocationInput, { InputSeparator } from './components/LocationInput';
import PredictionDropdown from './components/PredictionDropdown';
import RecentSearches from './components/RecentSearches';
import RouteCard from './components/RouteCard';

/**
 * Main SearchPanel component
 * Provides search interface for route planning with autocomplete
 */
const SearchPanel = ({ isDarkMode = false, onRouteChange, onClearSearch, onRouteSelect }) => {
  const { getPanelWidth, getResponsivePosition, isMobile } = useResponsive();
  const { loading, error, getDirections } = useDirections();
  const { currentLocation, isGettingLocation, getCurrentLocation } = useGeolocation();
  const { recentSearches } = useRecentSearches();

  const {
    originPredictions,
    destinationPredictions,
    fetchOriginPredictions,
    fetchDestinationPredictions,
    clearOriginPredictions,
    clearDestinationPredictions,
  } = useAutocomplete();

  const {
    isMinimized,
    origin,
    destination,
    isOriginFocused,
    isDestinationFocused,
    allRoutesData,
    originInputRef,
    destinationInputRef,
    originDebounceRef,
    setIsMinimized,
    setIsOriginFocused,
    setIsDestinationFocused,
    setAllRoutesData,
    handleOriginChange,
    handleDestinationChange,
    handleOriginSelect,
    handleDestinationSelect,
    handleCurrentLocationSelect,
    handleRecentSearchSelect,
  } = useSearchState({
    fetchOriginPredictions,
    fetchDestinationPredictions,
    clearOriginPredictions,
    clearDestinationPredictions,
    onClearSearch,
  });

  // Inject placeholder styles
  useEffect(() => {
    injectPlaceholderStyles(isDarkMode);
    return () => removePlaceholderStyles();
  }, [isDarkMode]);

  // Handle getting directions for all transportation modes
  const handleGetDirections = async () => {
    if (!origin || !destination) {
      console.warn('Both origin and destination are required');
      return;
    }

    setAllRoutesData({});

    try {
      const modes = ['driving', 'transit', 'bicycling', 'walking'];
      const routePromises = modes.map((mode) =>
        getDirections({
          origin,
          destination,
          mode,
          alternatives: false,
          units: 'metric',
        }).catch((err) => {
          console.warn(`Failed to get ${mode} directions:`, err.message);
          return null;
        })
      );

      const responses = await Promise.all(routePromises);

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

      setAllRoutesData(allRoutes);

      if (onRouteChange && Object.keys(allRoutes).length > 0) {
        onRouteChange(allRoutes);
      }
    } catch (err) {
      console.error('Failed to get directions:', err);
    }
  };

  // Minimized view
  if (isMinimized) {
    return <MinimizedView isDarkMode={isDarkMode} onExpand={() => setIsMinimized(false)} />;
  }

  // Main panel
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

        {/* Search Inputs */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <LocationInput
            type="origin"
            value={origin}
            onChange={handleOriginChange}
            onFocus={() => {
              setIsOriginFocused(true);
              setAllRoutesData({});
            }}
            onBlur={() => setTimeout(() => setIsOriginFocused(false), 200)}
            onClear={() => {
              handleOriginChange('');
              clearOriginPredictions();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && origin.trim()) {
                if (originDebounceRef.current) {
                  clearTimeout(originDebounceRef.current);
                }
                fetchOriginPredictions(origin.trim());
              }
            }}
            inputRef={originInputRef}
            isDarkMode={isDarkMode}
          />

          <InputSeparator isDarkMode={isDarkMode} />

          <LocationInput
            type="destination"
            value={destination}
            onChange={handleDestinationChange}
            onFocus={() => {
              setIsDestinationFocused(true);
              setAllRoutesData({});
            }}
            onBlur={() => setTimeout(() => setIsDestinationFocused(false), 200)}
            onClear={() => {
              handleDestinationChange('');
              clearDestinationPredictions();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && destination.trim()) {
                if (originDebounceRef.current) {
                  clearTimeout(originDebounceRef.current);
                }
                fetchDestinationPredictions(destination.trim());
              }
            }}
            inputRef={destinationInputRef}
            isDarkMode={isDarkMode}
          />

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
              <Navigation style={{ width: '16px', height: '16px', color: 'white' }} />
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

          {/* Route Results */}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['driving', 'transit', 'bicycling', 'walking'].map((mode) => (
                    <RouteCard
                      key={mode}
                      mode={mode}
                      routeData={allRoutesData[mode]}
                      onSelect={onRouteSelect}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Origin Autocomplete */}
        {isOriginFocused && (originPredictions.length > 0 || true) && (
          <PredictionDropdown
            type="origin"
            predictions={originPredictions}
            currentLocation={currentLocation}
            isGettingLocation={isGettingLocation}
            onPredictionSelect={handleOriginSelect}
            onCurrentLocationSelect={() =>
              handleCurrentLocationSelect('origin', getCurrentLocation)
            }
            isDarkMode={isDarkMode}
          />
        )}

        {/* Destination Autocomplete */}
        {isDestinationFocused && (destinationPredictions.length > 0 || true) && (
          <PredictionDropdown
            type="destination"
            predictions={destinationPredictions}
            currentLocation={currentLocation}
            isGettingLocation={isGettingLocation}
            onPredictionSelect={handleDestinationSelect}
            onCurrentLocationSelect={() =>
              handleCurrentLocationSelect('destination', getCurrentLocation)
            }
            isDarkMode={isDarkMode}
          />
        )}

        {/* Recent Searches */}
        {(isOriginFocused || isDestinationFocused) &&
          recentSearches.length > 0 &&
          originPredictions.length === 0 &&
          destinationPredictions.length === 0 && (
            <RecentSearches
              searches={recentSearches}
              onSelect={handleRecentSearchSelect}
              isDarkMode={isDarkMode}
            />
          )}
      </div>
    </div>
  );
};

export default SearchPanel;
