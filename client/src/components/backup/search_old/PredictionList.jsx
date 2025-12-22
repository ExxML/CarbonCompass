/**
 * Prediction List Component
 * Single Responsibility: Display autocomplete predictions with current location option
 */

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { SectionHeader } from '../ui/SharedComponents';
import {
  getPredictionMainText,
  getPredictionSecondaryText,
} from '../../services/autocompleteService';

export const PredictionItem = ({ prediction, onSelect, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const mutedColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div
      className="suggestion-card"
      onClick={() => onSelect(prediction)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(prediction)}
    >
      <div className="flex items-center gap-3">
        <MapPin className="h-4 w-4 flex-shrink-0 text-emerald-600" />
        <div className="min-w-0 flex-1">
          <div
            className={`text-sm font-medium ${textColor} overflow-hidden text-ellipsis whitespace-nowrap`}
          >
            {getPredictionMainText(prediction)}
          </div>
          <div
            className={`text-xs ${mutedColor} mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap`}
          >
            {getPredictionSecondaryText(prediction)}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CurrentLocationOption = ({ onSelect, isLoading, currentLocation, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const mutedColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div
      className="flex cursor-pointer items-center gap-3 border-b border-white/5 p-3 transition-all duration-200 hover:bg-emerald-600/10"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700">
        <Navigation className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1">
        <div className={`text-sm font-medium ${textColor} mb-0.5`}>
          {isLoading ? 'Getting location...' : 'Current Location'}
        </div>
        <div className={`text-xs ${mutedColor}`}>
          {currentLocation
            ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
            : 'Use your current position'}
        </div>
      </div>
    </div>
  );
};

export const PredictionList = ({
  title,
  titleColor,
  predictions,
  onSelectPrediction,
  onSelectCurrentLocation,
  showCurrentLocation,
  isGettingLocation,
  currentLocation,
  isDarkMode,
}) => {
  return (
    <div className="px-4 pb-3">
      <div className="suggestions-container">
        <SectionHeader icon={MapPin} title={title} color={titleColor} isDarkMode={isDarkMode} />

        {showCurrentLocation && (
          <CurrentLocationOption
            onSelect={onSelectCurrentLocation}
            isLoading={isGettingLocation}
            currentLocation={currentLocation}
            isDarkMode={isDarkMode}
          />
        )}

        {predictions.slice(0, 4).map((prediction, index) => (
          <div key={prediction.place_id}>
            <PredictionItem
              prediction={prediction}
              onSelect={onSelectPrediction}
              isDarkMode={isDarkMode}
            />
            {index < Math.min(predictions.length - 1, 3) && <div className="suggestion-divider" />}
          </div>
        ))}
      </div>
    </div>
  );
};
