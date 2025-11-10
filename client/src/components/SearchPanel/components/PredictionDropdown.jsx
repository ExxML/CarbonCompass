import { MapPin, Navigation } from 'lucide-react';

/**
 * Autocomplete predictions dropdown
 * Shows current location option and place predictions
 */
const PredictionDropdown = ({
  type, // 'origin' or 'destination'
  predictions,
  currentLocation,
  isGettingLocation,
  onPredictionSelect,
  onCurrentLocationSelect,
  isDarkMode,
}) => {
  const isOrigin = type === 'origin';
  const iconColor = isOrigin ? '#10b981' : '#dc2626';
  const title = isOrigin ? 'Starting Points' : 'Destinations';

  return (
    <div style={{ padding: '0 16px 12px 16px' }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 16px 8px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin
              style={{
                width: '14px',
                height: '14px',
                color: iconColor,
              }}
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: '500',
                color: isDarkMode ? '#d1d5db' : '#6b7280',
                fontFamily: 'Roboto, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {title}
            </span>
          </div>
        </div>

        {/* Current Location Option */}
        <div
          onClick={onCurrentLocationSelect}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Navigation
              style={{
                width: '16px',
                height: '16px',
                color: 'white',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
                marginBottom: '2px',
              }}
            >
              {isGettingLocation ? 'Getting location...' : 'Current Location'}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {currentLocation
                ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                : 'Use your current position'}
            </div>
          </div>
        </div>

        {/* Prediction List */}
        {predictions.slice(0, 4).map((prediction, index) => (
          <div
            key={prediction.place_id}
            onClick={() => onPredictionSelect(prediction)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderBottom:
                index < Math.min(predictions.length - 1, 3)
                  ? '1px solid rgba(255, 255, 255, 0.05)'
                  : 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin style={{ width: '16px', height: '16px', color: iconColor, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: isDarkMode ? '#f9fafb' : '#111827',
                    fontFamily: 'Roboto, sans-serif',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {prediction.structured_formatting?.main_text || prediction.description}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: isDarkMode ? '#d1d5db' : '#6b7280',
                    fontFamily: 'Roboto, sans-serif',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  {prediction.structured_formatting?.secondary_text || ''}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionDropdown;
