/**
 * MinimizedView Component
 * Displays collapsed carbon panel state
 */

import { Leaf } from 'lucide-react';

const MinimizedView = ({ carbonData, isDarkMode, isMobile, onExpand }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: isMobile ? '8px' : '16px',
        left: isMobile ? '8px' : '16px',
        zIndex: 9999,
      }}
    >
      <div
        onClick={onExpand}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
          <Leaf style={{ width: '20px', height: '20px', color: '#10b981' }} />
          <span
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: isDarkMode ? '#f9fafb' : '#374151',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {carbonData.totalSaved}kg CO₂
          </span>
        </div>
      </div>
    </div>
  );
};

export default MinimizedView;
