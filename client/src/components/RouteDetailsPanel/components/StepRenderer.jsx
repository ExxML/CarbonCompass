import {
  stripHtml,
  getTurnIcon,
  getHighwayInfo,
  getWalkingContext,
  getBikeContext,
} from '../utils/stepHelpers';

/**
 * Renders a single direction step for any transportation mode
 */
const StepRenderer = ({ step, stepIndex, mode, isDarkMode, totalSteps }) => {
  const instructions = stripHtml(step.instructions) || 'Continue';
  const distance = step.distance?.text || '';
  const duration = step.duration?.text || '';

  // Transit mode uses special rendering
  if (mode === 'transit' && step.travel_mode === 'TRANSIT') {
    const td = step.transit_details;
    if (!td) return null;

    return (
      <div key={stepIndex} className="relative mb-4 pl-6">
        <div
          className="absolute left-0 top-1 h-2 w-2 rounded-full border-2 border-white"
          style={{ background: td.transit_line?.color || '#2563eb' }}
        />
        <div className="mb-2">
          <div
            className={`mb-0.5 text-[13px] font-semibold ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
          >
            {td.departure_time || 'N/A'}
          </div>
          <div className={`text-[11px] ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {td.departure_stop?.name || 'Unknown Stop'}
          </div>
        </div>
        <div
          className="mb-1.5 inline-flex items-center gap-1.5 rounded-xl px-2 py-1"
          style={{ background: td.transit_line?.color || '#2563eb' }}
        >
          <div className="text-[11px] font-bold text-white">
            {td.transit_line?.vehicle || 'Transit'} {td.transit_line?.name || '?'}
          </div>
        </div>
        <div className={`mb-2 text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {step.duration?.text || 'N/A'}
          {td.num_stops ? ` (${td.num_stops} stops)` : ''}
        </div>
        <div>
          <div
            className={`mb-0.5 text-[13px] font-semibold ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
          >
            {td.arrival_time || 'N/A'}
          </div>
          <div className={`text-[11px] ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {td.arrival_stop?.name || 'Unknown Stop'}
          </div>
        </div>
        {stepIndex < totalSteps - 1 && (
          <div
            className={`absolute -bottom-4 left-[3px] top-3 w-0.5 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}
          />
        )}
      </div>
    );
  }

  // Get mode-specific context
  let context = null;
  let mainColor = '#6b7280';

  if (mode === 'driving') {
    mainColor = '#dc2626';
    const icon = getTurnIcon(instructions);
    const highway = getHighwayInfo(instructions);
    context = { icon, highway };
  } else if (mode === 'walking') {
    context = getWalkingContext(instructions);
    mainColor = context.color;
  } else if (mode === 'bicycling') {
    context = getBikeContext(instructions);
    mainColor = context.color;
  }

  return (
    <div key={stepIndex} className="relative mb-4 pl-6">
      <div
        className="absolute left-0 top-1 h-2 w-2 rounded-full border-2 border-white"
        style={{ background: mainColor }}
      />
      <div className="mb-1 flex items-center gap-2">
        {context && (
          <span className={mode === 'driving' ? 'text-base' : 'text-xs'}>{context.icon}</span>
        )}
        <span className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {distance} • {duration}
        </span>
        {mode !== 'driving' && context?.type && (
          <span className="rounded bg-emerald-500/10 px-1 py-0.5 text-[9px] text-emerald-600">
            {context.type}
          </span>
        )}
      </div>
      <div
        className={`${mode === 'driving' ? 'text-[13px] font-medium' : 'text-xs font-normal'} mb-0.5 leading-tight ${isDarkMode
            ? mode === 'driving'
              ? 'text-gray-50'
              : 'text-gray-300'
            : mode === 'driving'
              ? 'text-gray-900'
              : 'text-gray-500'
          }`}
      >
        {instructions}
      </div>
      {mode === 'driving' && context?.highway && (
        <div className="mt-1 inline-flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5">
          <span className="text-[10px] font-bold text-blue-500">{context.highway}</span>
        </div>
      )}
      {stepIndex < totalSteps - 1 && (
        <div
          className={`absolute -bottom-4 left-[3px] top-3 w-0.5 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}
        />
      )}
    </div>
  );
};

export default StepRenderer;
