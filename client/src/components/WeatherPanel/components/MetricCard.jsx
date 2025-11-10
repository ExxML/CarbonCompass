/**
 * Weather metric card component
 * Compact display for individual weather metrics
 */
const MetricCard = ({ icon, value, label, isDarkMode }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '8px 6px',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        minWidth: '60px',
        flex: '1',
        maxWidth: '80px',
      }}
    >
      {icon}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: '600',
            color: isDarkMode ? '#f9fafb' : '#111827',
            fontFamily: 'Roboto, sans-serif',
            lineHeight: '1.1',
            textAlign: 'center',
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontSize: '9px',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            fontFamily: 'Roboto, sans-serif',
            textAlign: 'center',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default MetricCard;
