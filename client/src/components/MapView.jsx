import { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import RoutePolyline from './RoutePolyline';
import SearchPanel from './SearchPanel';
import WeatherPanel from './WeatherPanel';
import CarbonPanel from './CarbonPanel';
import TripProgressPanel from './TripProgressPanel';
import { useTripTracking } from '../hooks/useTripTracking';
import lightMapStyles from '../styles/lightMapStyles.js';
import darkMapStyles from '../styles/darkMapStyles.js';
import { decodePolyline } from '../utils/decodePolyline.js';

function TrafficLayer({ isVisible }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google || !window.google.maps) return;

    const trafficLayer = new window.google.maps.TrafficLayer();

    if (isVisible) {
      trafficLayer.setMap(map);
    } else {
      trafficLayer.setMap(null);
    }

    // Cleanup function
    return () => {
      trafficLayer.setMap(null);
    };
  }, [map, isVisible]);

  return null;
}

function ConfigureControls() {
  const map = useMap();

  useEffect(() => {
    // Wait until both the map and the Google API are available
    if (!map || !window.google || !window.google.maps) return;

    map.setOptions({
      // start clean, then enable what you want
      disableDefaultUI: true,
      mapTypeControl: false,
      fullscreenControl: false,

      zoomControl: false,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
      },
      // example of moving Map/Satellite if you re-enable it:
      // mapTypeControl: true,
      // mapTypeControlOptions: {
      //   position: window.google.maps.ControlPosition.TOP_LEFT,
      //   style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      // },
    });
  }, [map]);

  return null;
}

function StyleController({ isDarkMode }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    console.log('StyleController: Applying styles for', isDarkMode ? 'dark' : 'light', 'mode');
    console.log('Styles array:', isDarkMode ? darkMapStyles : lightMapStyles);

    const styles = isDarkMode ? darkMapStyles : lightMapStyles;

    // Force refresh by clearing styles first, then applying new ones
    map.setOptions({ styles: [] });

    // Use setTimeout to ensure the clear happens before applying new styles
    setTimeout(() => {
      map.setOptions({ styles });
      console.log('Styles applied successfully');
    }, 50);
  }, [map, isDarkMode]);

  return null;
}

export default function MapView() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const defaultCenter = { lat: 49.2606, lng: -123.246 };
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [allRoutes, setAllRoutes] = useState({});
  const [showTraffic, setShowTraffic] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const clearSearchPanelRef = useRef(null);

  // Trip tracking
  const {
    isTracking,
    currentLocation,
    tripProgress,
    error: trackingError,
    startTracking,
    stopTracking,
  } = useTripTracking();

  // Debug logging
  useEffect(() => {
    console.log('Dark mode changed:', isDarkMode);
    console.log('Using styles:', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  if (!apiKey) return <div>Missing Google Maps API key</div>;

  const handleRouteChange = (routesData) => {
    console.log('Routes data received:', routesData);

    // Handle both single route (legacy) and multiple routes
    if (routesData && typeof routesData === 'object') {
      // Check if it's the new multi-route format
      if (routesData.driving || routesData.transit || routesData.bicycling || routesData.walking) {
        setAllRoutes(routesData);

        // Set origin and destination from the first available route
        const firstRoute = Object.values(routesData).find((data) => data?.routes?.[0]);
        if (firstRoute?.routes?.[0]) {
          const route = firstRoute.routes[0];

          if (route.start_location) {
            setOrigin({
              latLng: route.start_location,
              address: route.start_address,
            });
          }

          if (route.end_location) {
            setDestination({
              latLng: route.end_location,
              address: route.end_address,
            });
          }
        }
      } else if (routesData.routes && routesData.routes.length > 0) {
        // Legacy single route format
        const bestRoute = routesData.routes[0];

        if (bestRoute.start_location) {
          setOrigin({
            latLng: bestRoute.start_location,
            address: bestRoute.start_address,
          });
        }

        if (bestRoute.end_location) {
          setDestination({
            latLng: bestRoute.end_location,
            address: bestRoute.end_address,
          });
        }

        // Convert to new format for consistency
        setAllRoutes({ driving: routesData });
      }
    }
  };

  // Handle starting trip tracking
  const handleStartTracking = (routeData) => {
    if (!routeData) {
      console.error('No route data provided for tracking');
      return;
    }

    console.log('Starting trip tracking with route:', routeData);
    startTracking(routeData);
  };

  // Handle stopping trip tracking and clear search panel
  const handleStopTracking = () => {
    stopTracking();
    if (clearSearchPanelRef.current) {
      clearSearchPanelRef.current();
    }
    // Also clear MapView's route state
    setAllRoutes({});
    setOrigin(null);
    setDestination(null);
  };

  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      <div style={{ position: 'relative', width: '100vw', height: '100dvh' }}>
        {/* Map Component - Keep Original Style */}
        <Map
          key={`map-${isDarkMode ? 'dark' : 'light'}`}
          defaultCenter={defaultCenter}
          defaultZoom={13}
          style={{ width: '100vw', height: '100dvh' }}
          options={{
            disableDefaultUI: true,
            mapTypeControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
            styles: isDarkMode ? darkMapStyles : lightMapStyles,
          }}
        >
          <ConfigureControls />
          <StyleController isDarkMode={isDarkMode} />
          <TrafficLayer isVisible={showTraffic} />

          {origin?.latLng && <Marker position={origin.latLng} />}
          {destination?.latLng && <Marker position={destination.latLng} />}

          {/* Render polylines for all available routes */}
          {Object.entries(allRoutes).map(([mode, routeData]) => {
            const route = routeData?.routes?.[0];
            if (!route?.polyline) return null;

            const decodedPath = decodePolyline(route.polyline);
            const modeConfig = {
              driving: { color: '#dc2626', weight: 5, opacity: 0.8 },
              transit: { color: '#2563eb', weight: 5, opacity: 0.8 },
              bicycling: { color: '#16a34a', weight: 5, opacity: 0.8 },
              walking: { color: '#7c3aed', weight: 5, opacity: 0.8 },
            };

            const config = modeConfig[mode] || { color: '#6b7280', weight: 5, opacity: 0.8 };

            return (
              <RoutePolyline
                key={mode}
                path={decodedPath}
                strokeColor={config.color}
                strokeWeight={config.weight}
                strokeOpacity={config.opacity}
                fit={mode === Object.keys(allRoutes)[0]} // Only fit bounds for the first route
              />
            );
          })}
        </Map>

        {/* Google Maps-style Search Panel */}
        <SearchPanel
          key="search-panel"
          isDarkMode={isDarkMode}
          onRouteChange={handleRouteChange}
          onStartTracking={handleStartTracking}
          onClearSearch={(clearFn) => {
            clearSearchPanelRef.current = clearFn;
          }}
        />

        {/* Trip Progress Panel */}
        <TripProgressPanel
          isDarkMode={isDarkMode}
          isTracking={isTracking}
          tripProgress={tripProgress}
          currentLocation={currentLocation}
          onStopTracking={handleStopTracking}
        />

        {/* Current Location Marker */}
        {currentLocation && (
          <Marker
            position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
            options={{
              icon: {
                path: window.google?.maps?.SymbolPath?.CIRCLE,
                fillColor: '#4285f4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 8,
              },
            }}
          />
        )}

        {/* Route Legend */}
        {Object.keys(allRoutes).length > 0 && (
          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 9999,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px',
              minWidth: '160px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              Route Legend
            </div>
            {Object.keys(allRoutes).map((mode) => {
              const modeConfig = {
                driving: { icon: '🚗', name: 'Driving', color: '#dc2626' },
                transit: { icon: '🚌', name: 'Transit', color: '#2563eb' },
                bicycling: { icon: '🚴', name: 'Biking', color: '#16a34a' },
                walking: { icon: '🚶', name: 'Walking', color: '#7c3aed' },
              };

              const config = modeConfig[mode] || { icon: '🗺️', name: mode, color: '#6b7280' };

              return (
                <div
                  key={mode}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '3px',
                      backgroundColor: config.color,
                      borderRadius: '2px',
                    }}
                  />
                  <span style={{ fontSize: '12px' }}>{config.icon}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: isDarkMode ? '#d1d5db' : '#6b7280',
                      fontFamily: 'Roboto, sans-serif',
                    }}
                  >
                    {config.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Weather Panel */}
        <WeatherPanel isDarkMode={isDarkMode} />

        {/* Carbon Panel */}
        <CarbonPanel isDarkMode={isDarkMode} />

        {/* Traffic Toggle Button */}
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 9999,
            background: showTraffic ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            padding: '12px 16px',
            border: showTraffic
              ? '1px solid rgba(37, 99, 235, 0.4)'
              : '1px solid rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              background: showTraffic ? '#dc2626' : '#6b7280',
              borderRadius: '50%',
              transition: 'background-color 0.3s ease',
            }}
          />
          <span
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: showTraffic ? '#2563eb' : '#374151',
              fontFamily: 'Roboto, sans-serif',
              transition: 'color 0.3s ease',
            }}
          >
            {showTraffic ? 'Hide Traffic' : 'Show Traffic'}
          </span>
        </button>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            position: 'fixed',
            top: '76px',
            right: '16px',
            zIndex: 9999,
            background: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            padding: '12px 16px',
            border: isDarkMode
              ? '1px solid rgba(75, 85, 99, 0.4)'
              : '1px solid rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              background: isDarkMode ? '#1f2937' : '#f59e0b',
              borderRadius: '50%',
              transition: 'background-color 0.3s ease',
            }}
          />
          <span
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: isDarkMode ? '#4b5563' : '#374151',
              fontFamily: 'Roboto, sans-serif',
              transition: 'color 0.3s ease',
            }}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        {/* Trip Tracking Error Display */}
        {trackingError && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10000,
              background: 'rgba(220, 38, 38, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px 20px',
              maxWidth: '300px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                fontFamily: 'Roboto, sans-serif',
                marginBottom: '8px',
              }}
            >
              Trip Tracking Error
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {trackingError}
            </div>
          </div>
        )}
      </div>
    </APIProvider>
  );
}
