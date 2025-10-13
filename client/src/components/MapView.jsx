import { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import { Home } from 'lucide-react';
import RoutePolyline from './RoutePolyline';
import SearchPanel from './SearchPanel';
import RouteDetailsPanel from './RouteDetailsPanel';
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
      streetViewControl: false,
      rotateControl: false,
      scaleControl: false,
      panControl: false,
      overviewMapControl: false,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
      },
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

export default function MapView({ onNavigateToLanding }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const defaultCenter = { lat: 49.2606, lng: -123.246 };
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [allRoutes, setAllRoutes] = useState({});
  const [showTraffic, setShowTraffic] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedRouteData, setSelectedRouteData] = useState(null);
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

    // Clear selected route when new routes are loaded
    setSelectedRoute(null);
    setSelectedRouteData(null);

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

  // Handle route selection for detailed view
  const handleRouteSelect = (mode, routeData) => {
    console.log('Route selected:', mode, routeData);
    setSelectedRoute(mode);
    setSelectedRouteData(routeData);
  };

  // Handle closing the route details panel
  const handleCloseRouteDetails = () => {
    setSelectedRoute(null);
    setSelectedRouteData(null);
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
    setSelectedRoute(null);
    setSelectedRouteData(null);
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
            streetViewControl: false,
            rotateControl: false,
            scaleControl: false,
            panControl: false,
            overviewMapControl: false,
            zoomControl: false,
            gestureHandling: 'greedy',
            styles: isDarkMode ? darkMapStyles : lightMapStyles,
          }}
        >
          <ConfigureControls />
          <StyleController isDarkMode={isDarkMode} />
          <TrafficLayer isVisible={showTraffic} />

          {origin?.latLng && <Marker position={origin.latLng} />}
          {destination?.latLng && <Marker position={destination.latLng} />}

          {/* Transit Stop Markers */}
          {allRoutes.transit &&
            allRoutes.transit.routes?.[0]?.steps
              ?.filter((step) => step.transit_details)
              ?.map((step, index) => {
                const transitDetails = step.transit_details;
                const isDeparture = index % 2 === 0;

                return (
                  <Marker
                    key={`transit-stop-${index}`}
                    position={
                      isDeparture
                        ? transitDetails.departure_stop.location
                        : transitDetails.arrival_stop.location
                    }
                    icon={{
                      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="8"
                                  fill="${transitDetails.transit_line.color || '#2563eb'}"
                                  stroke="white" stroke-width="2"/>
                          <text x="10" y="14" text-anchor="middle" fill="white"
                                font-size="10" font-weight="bold">
                            ${transitDetails.transit_line.name}
                          </text>
                        </svg>
                      `)}`,
                      scaledSize: new window.google.maps.Size(20, 20),
                      anchor: new window.google.maps.Point(10, 10),
                    }}
                    title={`${isDeparture ? 'Departure' : 'Arrival'}: ${transitDetails.transit_line.name}`}
                  />
                );
              })}

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
          onRouteSelect={handleRouteSelect}
          onClearSearch={(clearFn) => {
            clearSearchPanelRef.current = clearFn;
          }}
        />

        {/* Route Details Panel */}
        <RouteDetailsPanel
          isDarkMode={isDarkMode}
          selectedRoute={selectedRoute}
          routeData={selectedRouteData}
          onClose={handleCloseRouteDetails}
          onStartTracking={handleStartTracking}
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

        {/* Weather Panel */}
        <WeatherPanel isDarkMode={isDarkMode} currentLocation={currentLocation} />

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

        {/* Home Button */}
        {onNavigateToLanding && (
          <button
            onClick={onNavigateToLanding}
            style={{
              position: 'fixed',
              top: '136px',
              right: '16px',
              zIndex: 9999,
              background: 'rgba(16, 185, 129, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              padding: '12px 16px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Home
              style={{
                width: '16px',
                height: '16px',
                color: '#10b981',
              }}
            />
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#10b981',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Home
            </span>
          </button>
        )}

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
