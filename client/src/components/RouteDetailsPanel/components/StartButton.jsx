import { Play } from 'lucide-react';

/**
 * Start trip tracking button
 */
const StartButton = ({ onStartTracking, routeData }) => {
  if (!onStartTracking) {
    return null;
  }

  return (
    <div
      style={{
        paddingTop: '8px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <button
        onClick={() => onStartTracking(routeData)}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'rgba(16, 185, 129, 0.8)',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(16, 185, 129, 1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(16, 185, 129, 0.8)';
        }}
      >
        <Play style={{ width: '16px', height: '16px', color: 'white' }} />
        <span
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'white',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          Start Trip Tracking
        </span>
      </button>
    </div>
  );
};

export default StartButton;
