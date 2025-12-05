import { X } from 'lucide-react';

/**
 * Header component for RouteDetailsPanel
 */
const Header = ({ config, isDarkMode, onClose }) => {
  return (
    <div className="flex items-center justify-between border-b border-white/25 p-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">{config.icon}</span>
        <span
          className={`font-['Roboto'] text-base font-medium ${
            isDarkMode ? 'text-gray-50' : 'text-gray-900'
          }`}
        >
          {config.name} Route
        </span>
      </div>
      <button
        onClick={onClose}
        className="cursor-pointer rounded-full border-none bg-transparent p-1 transition-colors hover:bg-white/10 dark:hover:bg-white/10"
      >
        <X className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
      </button>
    </div>
  );
};

export default Header;
