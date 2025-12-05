/**
 * Header Component
 * Panel header with title and minimize button
 */

import { Leaf, X } from 'lucide-react';

const Header = ({ isDarkMode, onMinimize }) => {
  return (
    <div
      className="flex items-center justify-between p-4 border-b border-white/25"
    >
      <div className="flex items-center gap-2">
        <Leaf className="w-5 h-5 text-emerald-500" />
        <span
          className={`text-base font-medium font-roboto ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
        >
          Carbon Impact
        </span>
      </div>
      <button
        onClick={onMinimize}
        className={`p-1 rounded-full bg-transparent border-none cursor-pointer transition-colors duration-200 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
      >
        <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
      </button>
    </div>
  );
};

export default Header;
