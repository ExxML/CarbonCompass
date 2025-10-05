import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

/**
 * RoutePolyline
 * Imperatively renders a Google Maps Polyline for a decoded path array.
 * Props:
 *  - path: [{lat,lng}, ...]
 *  - strokeColor, strokeOpacity, strokeWeight: styling (defaults provided)
 *  - fit: boolean (auto-fit bounds to path when created)
 *  - onReady: callback(polylineInstance)
 *  - clickable: defaults false (we don't need events for route display)
 */
export default function RoutePolyline({
  path,
  strokeColor = '#4285F4',
  strokeOpacity = 1,
  strokeWeight = 5,
  fit = false,
  onReady,
  clickable = false,
}) {
  const map = useMap();
  const polyRef = useRef(null);

  useEffect(() => {
    if (!map) return; // map not yet available

    // Destroy any existing polyline
    if (polyRef.current) {
      polyRef.current.setMap(null);
      polyRef.current = null;
    }

    if (Array.isArray(path) && path.length > 0) {
      polyRef.current = new window.google.maps.Polyline({
        map,
        path,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        clickable,
      });

      if (fit) {
        try {
          const bounds = new window.google.maps.LatLngBounds();
          path.forEach((p) => bounds.extend(p));
          map.fitBounds(bounds, 48); // padding
        } catch {
          // silent – bounds calc failed
        }
      }
      if (onReady) onReady(polyRef.current);
    }

    return () => {
      if (polyRef.current) {
        polyRef.current.setMap(null);
        polyRef.current = null;
      }
    };
  }, [map, path, strokeColor, strokeOpacity, strokeWeight, fit, onReady, clickable]);

  return null; // Imperative overlay only
}
