import { Navigation } from 'lucide-react';
import map_behind from '../../assets/map_behind.png';
import gyi from '../../assets/gyi.png';

/**
 * Hero Section Component
 * Main landing section with logo, call-to-action button
 */
const HeroSection = ({ onNavigateToMap }) => {
  return (
    <div
      id="gyi-section"
      style={{
        position: 'relative',
        width: '1440px',
        height: '665px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '0',
        maxWidth: '90vw',
        zIndex: 10,
      }}
    >
      {/* Background map image */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '665px',
          background: `url(${map_behind}) center center/cover no-repeat`,
          backgroundSize: 'cover',
          opacity: 0.9,
          zIndex: 1,
          borderRadius: '44px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        }}
      />

      {/* GYI Image */}
      <img
        src={gyi}
        alt="Logo"
        style={{
          width: '960px',
          height: 'auto',
          flexShrink: 0,
          zIndex: 2,
          position: 'relative',
          maxWidth: '90vw',
        }}
      />

      {/* CTA Button - Centered and positioned lower */}
      <button
        onClick={onNavigateToMap}
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '150px',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: 'none',
          borderRadius: '50px',
          padding: '16px 80px',
          fontSize: '18px',
          fontWeight: '600',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.3s ease',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          zIndex: 3,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.3)';
        }}
      >
        <Navigation style={{ width: '20px', height: '20px' }} />
        Find Your Carbon Footprint
      </button>
    </div>
  );
};

export default HeroSection;
