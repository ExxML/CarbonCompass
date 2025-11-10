/**
 * CarbonMetric Component
 * Reusable metric card for carbon stats
 */
const CarbonMetric = ({ icon, value, label, iconColor, isDarkMode }) => {
  const IconComponent = icon;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 10px',
        borderRadius: '8px',
        background: 'rgba(220, 220, 220, 0.28)',
        border: '1px solid rgba(220, 220, 220, 0.38)',
        minWidth: '0',
        flex: '1 1 0',
      }}
    >
      <IconComponent style={{ width: '14px', height: '14px', color: iconColor, flexShrink: 0 }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
          minWidth: '0',
          flex: '1',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: isDarkMode ? '#f9fafb' : '#111827',
            fontFamily: 'Roboto, sans-serif',
            lineHeight: '1.2',
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontSize: '10px',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default CarbonMetric;
