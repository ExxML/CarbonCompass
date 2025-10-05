import { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import RoutePolyline from './RoutePolyline';
import SearchPanel from './SearchPanel';
import WeatherPanel from './WeatherPanel';
import CarbonPanel from './CarbonPanel';
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

      zoomControl: true,
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
  const [path, setPath] = useState([]);
  const [showTraffic, setShowTraffic] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Dark mode changed:', isDarkMode);
    console.log('Using styles:', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  if (!apiKey) return <div>Missing Google Maps API key</div>;

  const handleRouteChange = (directionsData) => {
    console.log('Route data received:', directionsData);

    if (directionsData && directionsData.routes && directionsData.routes.length > 0) {
      const bestRoute = directionsData.routes[0];

      // Set origin and destination markers
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

      // Decode and set the path for the polyline
      if (bestRoute.polyline) {
        const decodedPath = decodePolyline(bestRoute.polyline);
        setPath(decodedPath);
      }
    }
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
          <RoutePolyline path={path} fit strokeColor="#4285F4" strokeWeight={5} />
        </Map>

        {/* Google Maps-style Search Panel */}
        <SearchPanel isDarkMode={isDarkMode} onRouteChange={handleRouteChange} />

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
      </div>
    </APIProvider>
  );
}
