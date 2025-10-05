import { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import RoutePolyline from './RoutePolyline';

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

export default function MapView() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const defaultCenter = { lat: 49.2606, lng: -123.246 };
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const mode = 'driving';
  const [path, setPath] = useState([]);

  if (!apiKey) return <div>Missing Google Maps API key</div>;

  const handleRouteSearch = ({ origin, destination }) => {
    // Route search functionality will be implemented later
    console.log('Route Search:', { origin, destination });
  };

  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      <div style={{ position: 'relative', width: '100vw', height: '100dvh' }}>
        {/* Map Component - Keep Original Style */}
        <Map
          mapId="509005e80a0f2672b07a1f26"
          defaultCenter={defaultCenter}
          defaultZoom={13}
          style={{ width: '100vw', height: '100dvh' }}
          // IMPORTANT: keep options here free of google.maps enums
          options={{
            disableDefaultUI: true, // hides everything initially
            mapTypeControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
          }}
        >
          <ConfigureControls />

          {origin?.latLng && <Marker position={origin.latLng} />}
          {destination?.latLng && <Marker position={destination.latLng} />}
          <RoutePolyline path={path} fit strokeColor="#4285F4" strokeWeight={5} />
        </Map>
      </div>
    </APIProvider>
  );
}
