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
const SearchPanel = ({
  isDarkMode = false,
  onRouteChange,
  onClearSearch,
  onRouteSelect,
  onEnableTraffic,
}) => {
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
    originValue,
    destinationValue,
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

    // Use originValue/destinationValue for API (coords or address), fall back to display text
    const originForAPI = originValue || origin;
    const destinationForAPI = destinationValue || destination;


    setAllRoutesData({});

    try {
      const modes = ['driving', 'transit', 'bicycling', 'walking'];
      const routePromises = modes.map((mode) =>
        getDirections({
          origin: originForAPI,
          destination: destinationForAPI,
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

      if (onEnableTraffic && Object.keys(allRoutes).length > 0) {
        onEnableTraffic();
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
    <div className="fixed z-[9999]" style={{ ...getResponsivePosition('left') }}>
      <div
        className={`bg-white/10 backdrop-blur-[15px] ${isMobile ? 'rounded-xl' : 'rounded-2xl'} border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]`}
        style={{
          width: `${getPanelWidth(384)}px`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/25 p-4">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-blue-600" />
            <span
              className={`font-roboto text-base font-medium ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
            >
              Directions
            </span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className={`cursor-pointer rounded-full border-none bg-transparent p-1 transition-colors duration-200 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <X className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Search Inputs */}
        <div className="flex flex-col gap-3 p-4">
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
              className={`flex items-center justify-center gap-2 rounded-xl border-none px-4 py-3 transition-all duration-300 ${loading ? 'cursor-not-allowed bg-blue-600/50' : 'cursor-pointer bg-blue-600/80'
                }`}
            >
              <Navigation className="h-4 w-4 text-white" />
              <span className="font-roboto text-sm font-medium text-white">
                {loading ? 'Finding All Routes...' : 'Get All Routes'}
              </span>
            </button>
          )}

          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-red-600/30 bg-red-600/10 p-3">
              <p className="font-roboto m-0 text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Route Results */}
          {allRoutesData &&
            typeof allRoutesData === 'object' &&
            Object.keys(allRoutesData).length > 0 && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="font-roboto m-0 mb-3 text-base font-semibold text-emerald-600">
                  Routes Found!
                </p>
                <div className="flex flex-col gap-2">
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
              onSelect={(search) =>
                handleRecentSearchSelect(search, isOriginFocused, isDestinationFocused)
              }
              isDarkMode={isDarkMode}
            />
          )}
      </div>
    </div>
  );
};

export default SearchPanel;
