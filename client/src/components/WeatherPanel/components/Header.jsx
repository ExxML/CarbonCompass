import { Cloud, RefreshCw, X } from 'lucide-react';

/**
 * Weather panel header with minimize and refresh buttons
 */
const Header = ({ isDarkMode, loading, onRefresh, onMinimize }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Cloud style={{ width: '20px', height: '20px', color: '#6b7280' }} />
        <span
          style={{
            fontSize: '16px',
            fontWeight: '500',
            color: isDarkMode ? '#f9fafb' : '#111827',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          Weather
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            padding: '4px',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            opacity: loading ? 0.5 : 1,
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : '#f3f4f6';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <RefreshCw
            style={{
              width: '16px',
              height: '16px',
              color: isDarkMode ? '#d1d5db' : '#6b7280',
              animation: loading ? 'spin 1s linear infinite' : 'none',
            }}
          />
        </button>
        <button
          onClick={onMinimize}
          style={{
            padding: '4px',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : '#f3f4f6';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X style={{ width: '16px', height: '16px', color: isDarkMode ? '#d1d5db' : '#6b7280' }} />
        </button>
      </div>
    </div>
  );
};

export default Header;
