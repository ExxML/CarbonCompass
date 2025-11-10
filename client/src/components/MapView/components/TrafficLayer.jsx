/**
 * TrafficLayer Component
 * Manages Google Maps traffic layer visibility
 */

import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

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

export default TrafficLayer;
