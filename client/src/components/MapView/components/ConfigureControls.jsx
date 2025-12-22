/**
 * ConfigureControls Component
 * Configures Google Maps UI controls (disables default controls)
 */

import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

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

export default ConfigureControls;
