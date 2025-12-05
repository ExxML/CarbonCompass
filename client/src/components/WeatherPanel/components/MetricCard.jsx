/**
 * Weather metric card component
 * Compact display for individual weather metrics
 */
const MetricCard = ({ icon, value, label, isDarkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 px-1.5 py-2 rounded-lg bg-[rgba(220,220,220,0.28)] border border-[rgba(220,220,220,0.38)] min-w-[60px] flex-1 max-w-[80px]">
      {icon}
      <div className="flex flex-col items-center gap-0.5">
        <span
          className={`text-[11px] font-semibold font-['Roboto'] leading-tight text-center ${isDarkMode ? 'text-gray-50' : 'text-gray-900'
            }`}
        >
          {value}
        </span>
        <span
          className={`text-[9px] font-['Roboto'] text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default MetricCard;
