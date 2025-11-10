import { usePolyline } from './usePolyline';

/**
 * RoutePolyline Component
 * Imperatively renders a Google Maps Polyline for a decoded path array
 *
 * Following Single Responsibility Principle:
 * - Component handles props and rendering (declarative interface)
 * - Hook manages polyline lifecycle (imperative logic)
 * - Utility functions handle polyline operations (business logic)
 *
 * @param {Array} path - Array of {lat, lng} coordinates
 * @param {string} strokeColor - Line color (default: '#4285F4')
 * @param {number} strokeOpacity - Line opacity (default: 1)
 * @param {number} strokeWeight - Line width in pixels (default: 5)
 * @param {boolean} fit - Auto-fit bounds to path (default: false)
 * @param {Function} onReady - Callback when polyline is created
 * @param {boolean} clickable - Whether polyline is clickable (default: false)
 */
const RoutePolyline = ({
  path,
  strokeColor = '#4285F4',
  strokeOpacity = 1,
  strokeWeight = 5,
  fit = false,
  onReady,
  clickable = false,
}) => {
  // Use custom hook to manage polyline lifecycle
  usePolyline(
    path,
    {
      strokeColor,
      strokeOpacity,
      strokeWeight,
      clickable,
    },
    fit,
    onReady
  );

  // Imperative overlay only - no DOM rendering
  return null;
};

export default RoutePolyline;
