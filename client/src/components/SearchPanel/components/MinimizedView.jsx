import { Navigation } from 'lucide-react';

/**
 * Minimized view of the search panel
 * Shows a compact button that can be clicked to expand the panel
 */
const MinimizedView = ({ isDarkMode, onExpand }) => {
  return (
    <div className="fixed top-4 left-4 z-[9999]">
      <div
        className="bg-white/10 backdrop-blur-[10px] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-3 cursor-pointer border border-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:border-white/30"
        onClick={onExpand}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <Navigation className="w-5 h-5 text-blue-600" />
          <span
            className={`text-sm font-medium font-roboto ${isDarkMode ? 'text-gray-50' : 'text-gray-700'}`}
          >
            Directions
          </span>
        </div>
      </div>
    </div>
  );
};

export default MinimizedView;
