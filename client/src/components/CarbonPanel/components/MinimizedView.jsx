/**
 * MinimizedView Component
 * Displays collapsed carbon panel state
 */

import { Leaf } from 'lucide-react';

const MinimizedView = ({ carbonData, isDarkMode, isMobile, onExpand }) => {
  return (
    <div
      className={`fixed z-[9999] ${isMobile ? 'bottom-2 left-2' : 'bottom-4 left-4'}`}
    >
      <div
        onClick={onExpand}
        className="bg-white/10 backdrop-blur-[10px] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20 p-3 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-white/30"
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <Leaf className="w-5 h-5 text-emerald-500" />
          <span
            className={`text-sm font-medium font-roboto ${isDarkMode ? 'text-gray-50' : 'text-gray-700'}`}
          >
            {carbonData.totalSaved}kg CO₂
          </span>
        </div>
      </div>
    </div>
  );
};

export default MinimizedView;
