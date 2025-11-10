/**
 * RoutePolylines Component
 * Renders all route polylines with mode-specific colors
 */

import RoutePolyline from '../../RoutePolyline';
import { decodePolyline } from '../../../utils/decodePolyline';

const modeConfig = {
  driving: { color: '#dc2626', weight: 5, opacity: 0.8 },
  transit: { color: '#2563eb', weight: 5, opacity: 0.8 },
  bicycling: { color: '#16a34a', weight: 5, opacity: 0.8 },
  walking: { color: '#7c3aed', weight: 5, opacity: 0.8 },
};

function RoutePolylines({ allRoutes }) {
  if (!allRoutes || Object.keys(allRoutes).length === 0) return null;

  return (
    <>
      {Object.entries(allRoutes).map(([mode, routeData]) => {
        const route = routeData?.routes?.[0];
        if (!route?.polyline) return null;

        const decodedPath = decodePolyline(route.polyline);
        const config = modeConfig[mode] || { color: '#6b7280', weight: 5, opacity: 0.8 };

        return (
          <RoutePolyline
            key={mode}
            path={decodedPath}
            strokeColor={config.color}
            strokeWeight={config.weight}
            strokeOpacity={config.opacity}
            fit={mode === Object.keys(allRoutes)[0]} // Only fit bounds for the first route
          />
        );
      })}
    </>
  );
}

export default RoutePolylines;
