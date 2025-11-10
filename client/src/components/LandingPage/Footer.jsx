import { Github } from 'lucide-react';
import logo_1 from '../../assets/LOGO_1.png';

/**
 * Footer Component
 * Displays footer with logo, repository link, and team info
 */
const Footer = () => {
  return (
    <footer
      style={{
        marginTop: '60px',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        backgroundColor: '#2a2a2a',
        padding: '20px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#ffffff',
        fontFamily: '"Roboto", system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Left side - Logo and Carbon Compass text */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <img
          src={logo_1}
          alt="Carbon Compass Logo"
          style={{
            width: '140px',
            height: '140px',
          }}
        ></img>
      </div>

      {/* Right side - Repository and team info */}
      <div
        style={{
          textAlign: 'right',
          color: '#b0b0b0',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        <div style={{ marginBottom: '8px', textAlign: 'right' }}>
          <a
            href="https://github.com/ExxML/CarbonCompass"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#ffffff',
              textDecoration: 'underline',
              fontWeight: '800',
              fontSize: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Github style={{ width: '20px', height: '20px' }} />
            View Source
          </a>
        </div>
        <div style={{ marginTop: '12px', marginBottom: '12px' }}>Powered by Google LLC ©</div>
        <div>
          <div>Andy Wu, Timothy Mai</div>
          <div>Victor Thai, Johnny Ho</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
