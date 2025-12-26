import { useState, useRef } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import SearchPanel from './SearchPanel';
import RouteDetailsPanel from './RouteDetailsPanel';
import WeatherPanel from './WeatherPanel';
import CarbonPanel from './CarbonPanel';
import TripProgressPanel from './TripProgressPanel';
import MapControls from './MapView/components/MapControls';
import TrafficLayer from './MapView/components/TrafficLayer';
import ConfigureControls from './MapView/components/ConfigureControls';
import StyleController from './MapView/components/StyleController';
import TransitStopMarkers from './MapView/components/TransitStopMarkers';
import RoutePolylines from './MapView/components/RoutePolylines';
import ErrorDisplay from './MapView/components/ErrorDisplay';
import { useTripTracking } from '../hooks/useTripTracking';
import lightMapStyles from '../styles/lightMapStyles.js';
import darkMapStyles from '../styles/darkMapStyles.js';

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

  if (!apiKey) return <div>Missing Google Maps API key</div>;

  const handleRouteChange = (routesData) => {
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
      return;
    }

    startTracking(routeData);

    // Close the route details panel when tracking starts
    handleCloseRouteDetails();
  };

  // Handle route selection for detailed view
  const handleRouteSelect = (mode, routeData) => {
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
      <div className="relative w-screen h-screen">
        {/* Map Component - Keep Original Style */}
        <Map
          key={`map-${isDarkMode ? 'dark' : 'light'}`}
          defaultCenter={defaultCenter}
          defaultZoom={13}
          className="w-screen h-screen"
          options={{
            gestureHandling: 'greedy',
          }}
        >
          <ConfigureControls />
          <StyleController
            isDarkMode={isDarkMode}
            darkMapStyles={darkMapStyles}
            lightMapStyles={lightMapStyles}
          />
          <TrafficLayer isVisible={showTraffic} />

          {origin?.latLng && <Marker position={origin.latLng} />}
          {destination?.latLng && <Marker position={destination.latLng} />}

          {/* Transit Stop Markers */}
          <TransitStopMarkers transitRoute={allRoutes.transit} />

          {/* Route Polylines */}
          <RoutePolylines allRoutes={allRoutes} />
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
          onEnableTraffic={() => setShowTraffic(true)}
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

        {/* Map Control Buttons */}
        <MapControls
          onNavigateToLanding={onNavigateToLanding}
          showTraffic={showTraffic}
          onToggleTraffic={() => setShowTraffic(!showTraffic)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Error Display */}
        <ErrorDisplay error={trackingError} title="Trip Tracking Error" />
      </div>
    </APIProvider>
  );
}
