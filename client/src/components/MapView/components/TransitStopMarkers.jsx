/**
 * TransitStopMarkers Component
 * Renders transit stop markers (departure/arrival) on the map
 */

import { Marker } from '@vis.gl/react-google-maps';

function TransitStopMarkers({ transitRoute }) {
  if (!transitRoute?.routes?.[0]?.steps) return null;

  const transitSteps = transitRoute.routes[0].steps.filter((step) => step.transit_details);

  return (
    <>
      {transitSteps.map((step, index) => {
        const transitDetails = step.transit_details;
        const isDeparture = index % 2 === 0;

        return (
          <Marker
            key={`transit-stop-${index}`}
            position={
              isDeparture
                ? transitDetails.departure_stop.location
                : transitDetails.arrival_stop.location
            }
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="8"
                          fill="${transitDetails.transit_line.color || '#2563eb'}"
                          stroke="white" stroke-width="2"/>
                  <text x="10" y="14" text-anchor="middle" fill="white"
                        font-size="10" font-weight="bold">
                    ${transitDetails.transit_line.name}
                  </text>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(20, 20),
              anchor: new window.google.maps.Point(10, 10),
            }}
            title={`${isDeparture ? 'Departure' : 'Arrival'}: ${transitDetails.transit_line.name}`}
          />
        );
      })}
    </>
  );
}

export default TransitStopMarkers;
