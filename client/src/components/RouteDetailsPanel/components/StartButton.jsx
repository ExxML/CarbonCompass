import { Play } from 'lucide-react';

/**
 * Start trip tracking button
 */
const StartButton = ({ onStartTracking, routeData }) => {
  if (!onStartTracking) {
    return null;
  }

  return (
    <div className="border-t border-white/30 px-4 pb-4 pt-2">
      <button
        onClick={() => onStartTracking(routeData)}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-emerald-500/80 px-4 py-3 transition-all duration-300 hover:bg-emerald-500"
      >
        <Play className="h-4 w-4 text-white" />
        <span className="font-['Roboto'] text-sm font-medium text-white">Start Trip Tracking</span>
      </button>
    </div>
  );
};

export default StartButton;
