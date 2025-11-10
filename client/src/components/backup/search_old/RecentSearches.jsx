/**
 * Recent Searches Component
 * Single Responsibility: Display recent search history
 */

import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { SectionHeader } from '../ui/SharedComponents';

export const RecentSearchItem = ({ search, onSelect, isDarkMode, showDivider }) => {
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const mutedColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <>
      <div
        className="suggestion-card"
        onClick={() => onSelect(search)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(search)}
      >
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-medium ${textColor} overflow-hidden text-ellipsis whitespace-nowrap`}>
              {search.name}
            </div>
            <div className={`text-xs ${mutedColor} overflow-hidden text-ellipsis whitespace-nowrap mt-0.5`}>
              {search.address}
            </div>
          </div>
        </div>
      </div>
      {showDivider && <div className="suggestion-divider" />}
    </>
  );
};

export const RecentSearches = ({ searches, onSelectSearch, isDarkMode }) => {
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div className="px-4 pb-4">
      <div className="suggestions-container">
        <SectionHeader
          icon={Clock}
          title="Recent Searches"
          isDarkMode={isDarkMode}
        />
        {searches.slice(0, 3).map((search, index) => (
          <RecentSearchItem
            key={search.id}
            search={search}
            onSelect={onSelectSearch}
            isDarkMode={isDarkMode}
            showDivider={index < searches.length - 1 && index < 2}
          />
        ))}
      </div>
    </div>
  );
};
