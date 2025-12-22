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
      className="fixed right-4 z-[9999] backdrop-blur-[10px] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] py-3 px-4 cursor-pointer transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
      style={{
        top: `${16 + position * 60}px`,
        background: bgColor,
        border: `1px solid ${borderColor}`,
        width: width,
      }}
    >
      {Icon && (
        <Icon
          className="w-4.5 h-4.5 flex-shrink-0"
          style={{ color: finalIconColor }}
        />
      )}
      <span
        className="text-sm font-medium font-['Roboto'] transition-colors duration-300 whitespace-nowrap"
        style={{ color: textColor }}
      >
        {label}
      </span>
    </button>
  );
};

export default MapButton;
