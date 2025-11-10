import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { createPolyline, destroyPolyline, fitBoundsToPath } from './polylineManager';

/**
 * Custom hook for managing polyline lifecycle
 * Handles creation, updates, and cleanup of polyline
 *
 * @param {Array} path - Array of {lat, lng} coordinates
 * @param {Object} options - Polyline styling options
 * @param {boolean} fit - Whether to fit bounds to path
 * @param {Function} onReady - Callback when polyline is created
 * @returns {React.RefObject} Reference to the polyline instance
 */
export const usePolyline = (path, options, fit = false, onReady) => {
  const map = useMap();
  const polyRef = useRef(null);

  useEffect(() => {
    if (!map) return; // Map not yet available

    // Cleanup existing polyline
    if (polyRef.current) {
      destroyPolyline(polyRef.current);
      polyRef.current = null;
    }

    // Create new polyline if path is valid
    if (Array.isArray(path) && path.length > 0) {
      polyRef.current = createPolyline(map, path, options);

      // Fit bounds if requested
      if (fit) {
        fitBoundsToPath(map, path);
      }

      // Notify parent component
      if (onReady) {
        onReady(polyRef.current);
      }
    }

    // Cleanup on unmount
    return () => {
      if (polyRef.current) {
        destroyPolyline(polyRef.current);
        polyRef.current = null;
      }
    };
  }, [map, path, options, fit, onReady]);

  return polyRef;
};
