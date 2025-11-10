/**
 * Polyline Manager Utility
 * Handles polyline creation, styling, and lifecycle management
 */

/**
 * Creates a Google Maps Polyline instance
 * @param {google.maps.Map} map - The map instance
 * @param {Array} path - Array of {lat, lng} coordinates
 * @param {Object} options - Styling options for the polyline
 * @returns {google.maps.Polyline} The created polyline instance
 */
export const createPolyline = (map, path, options) => {
  const {
    strokeColor = '#4285F4',
    strokeOpacity = 1,
    strokeWeight = 5,
    clickable = false,
  } = options;

  return new window.google.maps.Polyline({
    map,
    path,
    strokeColor,
    strokeOpacity,
    strokeWeight,
    clickable,
  });
};

/**
 * Removes a polyline from the map
 * @param {google.maps.Polyline} polyline - The polyline to remove
 */
export const destroyPolyline = (polyline) => {
  if (polyline) {
    polyline.setMap(null);
  }
};

/**
 * Fits map bounds to show the entire polyline path
 * @param {google.maps.Map} map - The map instance
 * @param {Array} path - Array of {lat, lng} coordinates
 * @param {number} padding - Padding around bounds in pixels
 */
export const fitBoundsToPath = (map, path, padding = 48) => {
  if (!path || path.length === 0) return;

  try {
    const bounds = new window.google.maps.LatLngBounds();
    path.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, padding);
  } catch (error) {
    // Silent fail - bounds calculation failed
    console.warn('Failed to fit bounds to path:', error);
  }
};
