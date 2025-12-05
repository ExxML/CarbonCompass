import { Cloud, RefreshCw, X } from 'lucide-react';

/**
 * Weather panel header with minimize and refresh buttons
 */
const Header = ({ isDarkMode, loading, onRefresh, onMinimize }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/25">
      <div className="flex items-center gap-2">
        <Cloud className="w-5 h-5 text-gray-500" />
        <span
          className={`text-base font-medium font-['Roboto'] ${isDarkMode ? 'text-gray-50' : 'text-gray-900'
            }`}
        >
          Weather
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`p-1 rounded-full bg-transparent border-none transition-colors ${loading
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:bg-white/10 dark:hover:bg-white/10'
            }`}
        >
          <RefreshCw
            className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} ${loading ? 'animate-spin' : ''
              }`}
          />
        </button>
        <button
          onClick={onMinimize}
          className="p-1 rounded-full bg-transparent border-none cursor-pointer transition-colors hover:bg-white/10 dark:hover:bg-white/10"
        >
          <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
        </button>
      </div>
    </div>
  );
};

export default Header;
