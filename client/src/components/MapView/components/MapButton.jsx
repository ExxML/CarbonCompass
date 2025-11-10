/**
 * MapButton Component
 * Reusable glassmorphic button for map controls
 */

const MapButton = ({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  activeColor = '#2563eb',
  iconColor = '#374151',
  activeIconColor = null,
  position = 0,
  width = '140px',
  isDarkMode = false,
}) => {
  const bgColor = isActive
    ? `rgba(${parseInt(activeColor.slice(1, 3), 16)}, ${parseInt(activeColor.slice(3, 5), 16)}, ${parseInt(activeColor.slice(5, 7), 16)}, 0.15)`
    : 'rgba(255, 255, 255, 0.1)';

  const borderColor = isActive
    ? `rgba(${parseInt(activeColor.slice(1, 3), 16)}, ${parseInt(activeColor.slice(3, 5), 16)}, ${parseInt(activeColor.slice(5, 7), 16)}, 0.4)`
    : 'rgba(255, 255, 255, 0.2)';

  const finalIconColor = isActive && activeIconColor ? activeIconColor : iconColor;
  const textColor = isDarkMode ? '#ffffff' : isActive ? activeColor : '#374151';

  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        top: `${16 + position * 60}px`,
        right: '16px',
        zIndex: 9999,
        background: bgColor,
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '12px 16px',
        border: `1px solid ${borderColor}`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: width,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
      }}
    >
      {Icon && (
        <Icon
          style={{
            width: '18px',
            height: '18px',
            color: finalIconColor,
            flexShrink: 0,
          }}
        />
      )}
      <span
        style={{
          fontSize: '14px',
          fontWeight: '500',
          color: textColor,
          fontFamily: 'Roboto, sans-serif',
          transition: 'color 0.3s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </button>
  );
};

export default MapButton;
