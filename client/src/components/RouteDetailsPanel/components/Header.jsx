import { X } from 'lucide-react';

/**
 * Header component for RouteDetailsPanel
 */
const Header = ({ config, isDarkMode, onClose }) => {
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
        <span style={{ fontSize: '20px' }}>{config.icon}</span>
        <span
          style={{
            fontSize: '16px',
            fontWeight: '500',
            color: isDarkMode ? '#f9fafb' : '#111827',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {config.name} Route
        </span>
      </div>
      <button
        onClick={onClose}
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
  );
};

export default Header;
