import { Clock, MapPin } from 'lucide-react';

/**
 * Recent searches dropdown
 * Shows previously saved search locations
 */
const RecentSearches = ({ searches, onSelect, isDarkMode }) => {
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div style={{ padding: '0 16px 16px 16px' }}>
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
            <Clock
              style={{
                width: '14px',
                height: '14px',
                color: isDarkMode ? '#d1d5db' : '#6b7280',
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
              Recent Searches
            </span>
          </div>
        </div>

        {/* Search Items */}
        {searches.slice(0, 3).map((search, index) => (
          <div
            key={search.id}
            onClick={() => onSelect(search)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderBottom:
                index < searches.length - 1 && index < 2
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
              <MapPin style={{ width: '16px', height: '16px', color: '#2563eb', flexShrink: 0 }} />
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
                  {search.name}
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
                  {search.address}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
