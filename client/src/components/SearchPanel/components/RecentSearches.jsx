import { Clock, MapPin } from 'lucide-react';

/**
 * Recent searches dropdown
 * Shows previously saved search locations
 */
const RecentSearches = ({ searches, onSelect, isDarkMode }) => {
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div className="px-4 pb-4">
      <div
        className="bg-white/5 rounded-xl border border-white/20 overflow-hidden"
      >
        {/* Header */}
        <div
          className="py-3 px-4 pb-2 border-b border-white/10"
        >
          <div className="flex items-center gap-2">
            <Clock
              className={`w-3.5 h-3.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            />
            <span
              className={`text-xs font-medium font-roboto uppercase tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Recent Searches
            </span>
          </div>
        </div>

        {/* Search Items */}
        {searches.slice(0, 3).map((search, index) => (
          <div
            key={search.id}
            onClick={() => onSelect(search)}
            className={`py-3 px-4 cursor-pointer transition-all duration-200 hover:bg-white/10 ${index < searches.length - 1 && index < 2 ? 'border-b border-white/5' : ''
              }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-medium font-roboto overflow-hidden text-ellipsis whitespace-nowrap ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
                >
                  {search.name}
                </div>
                <div
                  className={`text-xs font-roboto overflow-hidden text-ellipsis whitespace-nowrap mt-0.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {search.address}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
