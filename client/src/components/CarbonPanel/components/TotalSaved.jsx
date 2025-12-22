/**
 * TotalSaved Component
 * Displays large CO2 savings number
 */

const TotalSaved = ({ totalSaved, isDarkMode, isMobile }) => {
  return (
    <div
      className={`flex flex-col items-center ${isMobile ? 'min-w-full border-r-0 pr-0' : 'min-w-[85px] border-r border-white/20 pr-2.5'}`}
    >
      <div
        className={`font-roboto text-[32px] font-bold leading-none ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
      >
        {totalSaved}
        <span className="ml-0.5 text-base">kg</span>
      </div>
      <div
        className={`font-roboto mt-1 text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
      >
        CO₂ Saved
      </div>
    </div>
  );
};

export default TotalSaved;
