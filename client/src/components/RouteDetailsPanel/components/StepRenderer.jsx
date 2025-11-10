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
      <div
        key={stepIndex}
        style={{ marginBottom: '16px', position: 'relative', paddingLeft: '24px' }}
      >
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '4px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: td.transit_line?.color || '#2563eb',
            border: '2px solid white',
          }}
        />
        <div style={{ marginBottom: '8px' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: isDarkMode ? '#f9fafb' : '#111827',
              marginBottom: '2px',
            }}
          >
            {td.departure_time || 'N/A'}
          </div>
          <div style={{ fontSize: '11px', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>
            {td.departure_stop?.name || 'Unknown Stop'}
          </div>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            background: td.transit_line?.color || '#2563eb',
            borderRadius: '12px',
            marginBottom: '6px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'white' }}>
            {td.transit_line?.vehicle || 'Transit'} {td.transit_line?.name || '?'}
          </div>
        </div>
        <div
          style={{
            fontSize: '10px',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            marginBottom: '8px',
          }}
        >
          {step.duration?.text || 'N/A'}
          {td.num_stops ? ` (${td.num_stops} stops)` : ''}
        </div>
        <div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: isDarkMode ? '#f9fafb' : '#111827',
              marginBottom: '2px',
            }}
          >
            {td.arrival_time || 'N/A'}
          </div>
          <div style={{ fontSize: '11px', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>
            {td.arrival_stop?.name || 'Unknown Stop'}
          </div>
        </div>
        {stepIndex < totalSteps - 1 && (
          <div
            style={{
              position: 'absolute',
              left: '3px',
              top: '12px',
              bottom: '-16px',
              width: '2px',
              background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            }}
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
    <div
      key={stepIndex}
      style={{ marginBottom: '16px', position: 'relative', paddingLeft: '24px' }}
    >
      <div
        style={{
          position: 'absolute',
          left: '0',
          top: '4px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: mainColor,
          border: '2px solid white',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        {context && (
          <span style={{ fontSize: mode === 'driving' ? '16px' : '12px' }}>{context.icon}</span>
        )}
        <span style={{ fontSize: '10px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
          {distance} • {duration}
        </span>
        {mode !== 'driving' && context?.type && (
          <span
            style={{
              fontSize: '9px',
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '1px 4px',
              borderRadius: '4px',
            }}
          >
            {context.type}
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: mode === 'driving' ? '13px' : '12px',
          fontWeight: mode === 'driving' ? '500' : 'normal',
          color: isDarkMode
            ? mode === 'driving'
              ? '#f9fafb'
              : '#d1d5db'
            : mode === 'driving'
              ? '#111827'
              : '#6b7280',
          marginBottom: '2px',
          lineHeight: '1.3',
        }}
      >
        {instructions}
      </div>
      {mode === 'driving' && context?.highway && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 6px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '4px',
            marginTop: '4px',
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#3b82f6' }}>
            {context.highway}
          </span>
        </div>
      )}
      {stepIndex < totalSteps - 1 && (
        <div
          style={{
            position: 'absolute',
            left: '3px',
            top: '12px',
            bottom: '-16px',
            width: '2px',
            background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        />
      )}
    </div>
  );
};

export default StepRenderer;
