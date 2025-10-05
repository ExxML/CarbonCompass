import { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  Polyline,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

/** tiny polyline decoder */
function decodePolyline(encoded) {
  let index = 0,
    lat = 0,
    lng = 0;
  const path = [];
  while (index < encoded.length) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;
    path.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return path;
}

/** Autocomplete wiring for a single input */
function AutocompleteInput({ placeholder, onPlace }) {
  const inputRef = useRef(null);
  const placesLib = useMapsLibrary('places');
  const map = useMap();

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;
    const ac = new placesLib.Autocomplete(inputRef.current, {
      // types: ["geocode"], // optionally restrict
      fields: ['place_id', 'geometry', 'formatted_address', 'name'],
    });

    // Bias results to current map viewport (nice UX)
    if (map) {
      const listener = map.addListener('bounds_changed', () => {
        ac.setBounds(map.getBounds());
      });
      // cleanup
      return () => listener.remove();
    }
  }, [placesLib, map]);

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;
    const ac = new placesLib.Autocomplete(inputRef.current, {
      fields: ['place_id', 'geometry', 'formatted_address', 'name'],
    });
    const onChanged = () => {
      const p = ac.getPlace();
      if (p && p.geometry) {
        const loc = p.geometry.location;
        onPlace({
          placeId: p.place_id,
          latLng: { lat: loc.lat(), lng: loc.lng() },
          label: p.formatted_address || p.name,
        });
      }
    };
    ac.addListener('place_changed', onChanged);
    return () => placesLib.event.clearInstanceListeners(ac);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placesLib]);

  return (
    <input ref={inputRef} placeholder={placeholder} className="gm-input" style={{ width: 320 }} />
  );
}

export default function MapView() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const defaultCenter = { lat: 49.2606, lng: -123.246 };
  const [origin, setOrigin] = useState(null); // {placeId, latLng, label}
  const [destination, setDestination] = useState(null);
  const [mode, setMode] = useState('driving'); // driving | walking | bicycling | transit
  const [path, setPath] = useState([]);

  async function fetchRoute() {
    if (!origin || !destination) return;

    // Prefer place_id when you have it (more accurate):
    const originParam = origin.placeId
      ? `place_id:${origin.placeId}`
      : `${origin.latLng.lat},${origin.latLng.lng}`;
    const destParam = destination.placeId
      ? `place_id:${destination.placeId}`
      : `${destination.latLng.lat},${destination.latLng.lng}`;

    const url = `/api/directions?origin=${encodeURIComponent(originParam)}&destination=${encodeURIComponent(destParam)}&mode=${mode}`;
    const res = await fetch(url);
    const data = await res.json();
    const encoded = data?.routes?.[0]?.overview_polyline?.points;
    if (encoded) setPath(decodePolyline(encoded));
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      {/* Top toolbar overlay */}
      <div
        className="gm-toolbar"
        style={{
          position: 'fixed',
          zIndex: 20,
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          gap: 8,
          display: 'flex',
          alignItems: 'center',
          background: 'white',
        }}
      >
        <AutocompleteInput placeholder="Origin" onPlace={setOrigin} />
        <span className="gm-sep" />
        <AutocompleteInput placeholder="Destination" onPlace={setDestination} />
        <select
          className="gm-input"
          style={{ width: 140 }}
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="driving">Driving</option>
          <option value="transit">Transit</option>
          <option value="walking">Walking</option>
          <option value="bicycling">Cycling</option>
        </select>
        <button className="gm-btn gm-btn-primary" onClick={fetchRoute}>
          Go
        </button>
      </div>

      {/* Map fills the viewport */}
      <Map
        defaultCenter={defaultCenter}
        defaultZoom={13}
        style={{ width: '100vw', height: '100dvh' }}
        gestureHandling="greedy"
      >
        {origin?.latLng && <Marker position={origin.latLng} />}
        {destination?.latLng && <Marker position={destination.latLng} />}
        {path.length > 0 && (
          <Polyline path={path} strokeColor="#4285F4" strokeOpacity={1} strokeWeight={5} />
        )}
      </Map>
    </APIProvider>
  );
}
