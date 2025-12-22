import { Cloud } from 'lucide-react';

/**
 * Minimized weather panel button
 */
const MinimizedView = ({ isDarkMode, weatherData, isMobile, onExpand }) => {
  return (
    <div
      className={`fixed ${isMobile ? 'bottom-2 right-2' : 'bottom-4 right-4'} z-[9999]`}
    >
      <div
        onClick={onExpand}
        className="minimized-panel bg-white/10 backdrop-blur-[10px] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20 p-3 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-white/30"
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <Cloud className="w-5 h-5 text-gray-500" />
          <span
            className={`text-sm font-medium font-['Roboto'] ${isDarkMode ? 'text-gray-50' : 'text-gray-700'
              }`}
          >
            {weatherData?.temperature ?? '--'}°C
          </span>
        </div>
      </div>
    </div>
  );
};

export default MinimizedView;
