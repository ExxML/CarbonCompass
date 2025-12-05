/**
 * CarbonMetric Component
 * Reusable metric card for carbon stats
 */
const CarbonMetric = ({ icon, value, label, iconColor, isDarkMode }) => {
  const IconComponent = icon;

  return (
    <div
      className="flex items-center gap-1.5 py-2 px-2.5 rounded-lg bg-[rgba(220,220,220,0.28)] border border-[rgba(220,220,220,0.38)] min-w-0 flex-1"
    >
      <IconComponent
        className="w-3.5 h-3.5 flex-shrink-0"
        style={{ color: iconColor }}
      />
      <div
        className="flex flex-col gap-px min-w-0 flex-1"
      >
        <span
          className={`text-xs font-semibold font-roboto leading-[1.2] ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
        >
          {value}
        </span>
        <span
          className={`text-[10px] font-roboto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default CarbonMetric;
