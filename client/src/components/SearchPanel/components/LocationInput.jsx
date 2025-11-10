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
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(5px)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.5)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {isOrigin ? (
          <div
            style={{
              width: '12px',
              height: '12px',
              border: '3px solid #10b981',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
        ) : (
          <svg
            style={{ width: '20px', height: '20px', color: iconColor, flexShrink: 0 }}
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
          className={className}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{
            flex: 1,
            background: 'transparent',
            outline: 'none',
            border: 'none',
            fontSize: '15px',
            color: isDarkMode ? '#f9fafb' : '#111827',
            fontWeight: '500',
            fontFamily: 'Roboto, sans-serif',
          }}
        />
        {value && (
          <button
            onClick={onClear}
            style={{
              padding: '4px',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X
              style={{
                width: '16px',
                height: '16px',
                color: isDarkMode ? '#d1d5db' : '#9ca3af',
              }}
            />
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
  <div style={{ display: 'flex', justifyContent: 'center', margin: '-6px 0' }}>
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        padding: '8px',
        border: '2px solid rgba(17, 24, 39, 0.1)',
      }}
    >
      <ArrowRight
        style={{
          width: '16px',
          height: '16px',
          color: isDarkMode ? '#d1d5db' : '#6b7280',
          transform: 'rotate(90deg)',
        }}
      />
    </div>
  </div>
);

export default LocationInput;
