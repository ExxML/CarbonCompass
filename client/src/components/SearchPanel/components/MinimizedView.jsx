import { Navigation } from 'lucide-react';

/**
 * Minimized view of the search panel
 * Shows a compact button that can be clicked to expand the panel
 */
const MinimizedView = ({ isDarkMode, onExpand }) => {
  return (
    <div style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 9999 }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          padding: '12px',
          cursor: 'pointer',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          transition: 'all 0.3s ease',
        }}
        onClick={onExpand}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
          <Navigation style={{ width: '20px', height: '20px', color: '#2563eb' }} />
          <span
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: isDarkMode ? '#f9fafb' : '#374151',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Directions
          </span>
        </div>
      </div>
    </div>
  );
};

export default MinimizedView;
