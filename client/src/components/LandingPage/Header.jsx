import logo_1 from '../../assets/LOGO_1.png';

/**
 * Header Component
 * Displays the navigation header with logo and navigation links
 */
const Header = ({ onNavigateToSection }) => {
  return (
    <header
      style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#1A3B00',
        fontSize: '24px',
        fontWeight: '400',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '200px',
        fontFamily: '"Roboto", system-ui, -apple-system, sans-serif',
        zIndex: 10,
        whiteSpace: 'nowrap',
        width: 'auto',
        minWidth: 'max-content',
        padding: '8px 10px',
      }}
    >
      {/* Logo */}
      <img
        src={logo_1}
        alt="Logo"
        style={{
          width: '150px',
          height: '150px',
          flexShrink: 0,
        }}
      />
      <p
        onClick={() => onNavigateToSection('gyi-section')}
        style={{
          margin: 0,
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'color 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.color = '#0d5f2b')}
        onMouseOut={(e) => (e.target.style.color = '#1A3B00')}
      >
        compass
      </p>
      <p
        onClick={() => onNavigateToSection('about-carbon-section')}
        style={{
          margin: 0,
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'color 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.color = '#0d5f2b')}
        onMouseOut={(e) => (e.target.style.color = '#1A3B00')}
      >
        about us
      </p>
      <p
        onClick={() => onNavigateToSection('gyi-section')}
        style={{
          margin: 0,
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'color 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.color = '#0d5f2b')}
        onMouseOut={(e) => (e.target.style.color = '#1A3B00')}
      >
        getting involved
      </p>
    </header>
  );
};

export default Header;
