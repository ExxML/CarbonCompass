/**
 * Route Results Component
 * Single Responsibility: Display all available route options
 */

import React from 'react';
import { RouteCard } from './RouteCard';
import { SuccessBox } from '../ui/SharedComponents';
import { TRANSPORT_MODES } from '../../constants';

export const RouteResults = ({ allRoutesData, onRouteSelect, isDarkMode }) => {
  if (!allRoutesData || Object.keys(allRoutesData).length === 0) {
    return null;
  }

  const modes = ['driving', 'transit', 'bicycling', 'walking'];

  return (
    <SuccessBox title="Routes Found!">
      <div className="flex flex-col gap-2">
        {modes.map((mode) => {
          const routeData = allRoutesData[mode];
          const route = routeData?.routes?.[0];
          const config = TRANSPORT_MODES[mode] || {
            icon: '🗺️',
            name: mode,
            color: '#6b7280',
          };

          return (
            <RouteCard
              key={mode}
              mode={mode}
              config={config}
              route={route ? routeData : null}
              onSelect={onRouteSelect}
              isDarkMode={isDarkMode}
            />
          );
        })}
      </div>
    </SuccessBox>
  );
};
