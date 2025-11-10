/**
 * TotalSaved Component
 * Displays large CO₂ savings number
 */

const TotalSaved = ({ totalSaved, isDarkMode, isMobile }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingRight: isMobile ? '0' : '10px',
        borderRight: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
        minWidth: isMobile ? '100%' : '85px',
      }}
    >
      <div
        style={{
          fontSize: '32px',
          fontWeight: '700',
          color: isDarkMode ? '#f9fafb' : '#111827',
          fontFamily: 'Roboto, sans-serif',
          lineHeight: '1',
        }}
      >
        {totalSaved}
        <span style={{ fontSize: '16px', marginLeft: '2px' }}>kg</span>
      </div>
      <div
        style={{
          fontSize: '10px',
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          fontFamily: 'Roboto, sans-serif',
          marginTop: '4px',
        }}
      >
        CO₂ Saved
      </div>
    </div>
  );
};

export default TotalSaved;
