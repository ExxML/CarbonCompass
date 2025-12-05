import { X, MapPin, ArrowRight } from 'lucide-react';

/**
 * Reusable location input component
 * Used for both origin and destination inputs
 */
const LocationInput = ({
  type, // 'origin' or 'destination'
  value,
  onChange,
  onFocus,
  onBlur,
  onClear,
  onKeyDown,
  inputRef,
  isDarkMode,
}) => {
  const isOrigin = type === 'origin';
  const iconColor = isOrigin ? '#10b981' : '#dc2626';
  const placeholder = isOrigin ? 'Choose starting point' : 'Where do you want to go?';
  const className = isOrigin ? 'search-input-origin' : 'search-input-destination';

  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-xl border border-white/30 bg-white/5 p-3 backdrop-blur-[5px] transition-all duration-300 hover:-translate-y-px hover:border-blue-600/50 hover:shadow-[0_4px_12px_rgba(37,99,235,0.1)]">
        {isOrigin ? (
          <div className="h-3 w-3 flex-shrink-0 rounded-full border-[3px] border-emerald-500" />
        ) : (
          <svg
            className="h-5 w-5 flex-shrink-0"
            style={{ color: iconColor }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          className={`font-roboto flex-1 border-none bg-transparent text-[15px] font-medium outline-none ${isDarkMode ? 'text-gray-50' : 'text-gray-900'} ${className}`}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {value && (
          <button
            onClick={onClear}
            className="cursor-pointer rounded-full border-none bg-transparent p-1 transition-colors duration-200 hover:bg-white/10"
          >
            <X className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`} />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Arrow separator between origin and destination inputs
 */
export const InputSeparator = ({ isDarkMode }) => (
  <div className="-my-1.5 flex justify-center">
    <div className="rounded-full border-2 border-gray-900/10 bg-white/10 p-2">
      <ArrowRight
        className={`h-4 w-4 rotate-90 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
      />
    </div>
  </div>
);

export default LocationInput;
