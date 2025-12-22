import React from 'react';
import {
  Navigation,
  Lightbulb,
  Info,
  Send,
  Github
} from 'lucide-react';
import logo_1 from '../assets/LOGO_1.png';
import logo_2 from '../assets/LOGO_2.png';
import background_0 from '../assets/background_0.png';
import map_behind from '../assets/map_behind.png';
import gyi from '../assets/gyi.png';

const LandingPage = ({ onNavigateToMap }) => {
  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: `url(${background_0}) center center/cover no-repeat`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '180px 0 0',
        position: 'relative',
        margin: 0,
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      {/* Header with Navlink */}
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
          onClick={() => scrollToSection('gyi-section')}
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
          onClick={() => scrollToSection('about-carbon-section')}
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
        <img
          src={logo_2}
          alt="Logo"
          style={{
            width: '100px',
            height: '100px',
            flexShrink: 0,
          }}
        />
      </header>

      {/* Sustainability Section */}
      <div
        style={{
          maxWidth: '1000px',
          width: '90%',
          textAlign: 'left',
          marginTop: '50px',
          marginBottom: '40px',
          padding: '20px 60px',
          alignSelf: 'center',
          zIndex: 10,
          position: 'relative',
        }}
      >
        <h2
          style={{
            color: '#1A3B00',
            fontSize: '48px',
            fontWeight: '400',
            fontFamily: '"Roboto", system-ui, -apple-system, sans-serif',
            margin: '0 0 2px 0',
            lineHeight: '0.8',
            textAlign: 'left',
          }}
        >
          <span
            style={{
              fontStyle: 'italic',
              fontSize: '36px',
              fontFamily: '"Microsoft Himalayas"',
            }}
          >
            Sustainability,
          </span>
          <br />
          <span
            style={{
              fontFamily: '"Microsoft Himalaya", serif',
              fontWeight: '400',
              fontSize: '120px',
              letterSpacing: '-4px',
            }}
          >
            one step at a time.
          </span>
        </h2>

        <div
          style={{
            color: '#666',
            fontSize: '16px',
            fontWeight: '400',
            fontFamily: '"Roboto", system-ui, -apple-system, sans-serif',
            lineHeight: '1.6',
            marginBottom: '20px',
            textAlign: 'left',
          }}
        >
          <p style={{ margin: '0 0 10px 0' }}>
            <span style={{ fontStyle: 'italic' }}>/kärben fo͝otprint/</span> · carbon footprint ·{' '}
            <span style={{ fontStyle: 'italic' }}>noun</span>
          </p>
          <p style={{ margin: 0 }}>
            the total amount of greenhouse gases, especially carbon dioxide, released into the
            atmosphere by a person's activities, such as using energy, traveling, and consuming
            products.
          </p>
        </div>
      </div>

      {/* Combined Map, Image, and CTA Section */}
      <div
        id="gyi-section"
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '60px',
          marginBottom: '40px',
          width: '100%',
          maxWidth: '1300px',
        }}
      >
        {/* Map Background Layer */}
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

      {/* Understanding Section */}
      <div
        id="about-carbon-section"
        style={{
          maxWidth: '1200px',
          width: '90%',
          textAlign: 'center',
          marginTop: '90px',
          marginBottom: '80px',
          padding: '60px 40px',
          alignSelf: 'center',
          zIndex: 10,
          position: 'relative',
        }}
      >
        <h2
          style={{
            color: '#1A3B00',
            fontSize: '48px',
            fontWeight: '400',
            fontFamily: '"Roboto", system-ui, -apple-system, sans-serif',
            margin: '0 0 20px 0',
            lineHeight: '0.9',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontStyle: 'italic',
              fontSize: '36px',
              fontFamily: '"Garamond", "Times New Roman", serif',
            }}
          >
            take a moment to
          </span>
          <br />
          <span
            style={{
              fontFamily: '"Microsoft Himalaya", serif',
              fontWeight: '400',
              fontSize: '100px',
              letterSpacing: '-3px',
            }}
          >
            understand your steps.
          </span>
        </h2>

        <div
          style={{
            color: '#666',
            fontSize: '16px',
            fontWeight: '400',
            fontFamily: '"Roboto", system-ui, -apple-system, sans-serif',
            lineHeight: '1.0',
            marginBottom: '40px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: '0 0 10px 0' }}>
            <span style={{ fontStyle: 'italic' }}>/kärben kom·pəs/</span> · carbon compass ·{' '}
            <span style={{ fontStyle: 'italic' }}>noun</span>
          </p>
          <p style={{ margin: 0 }}>
            Navigate through the city with a deeper understanding of every trip you make.
          </p>
        </div>

        {/* Feature Cards */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '40px',
            marginTop: '60px',
            flexWrap: 'wrap',
          }}
        >
          {/* Sustainable Goals Card */}
          <a
            href="https://sdgs.un.org/goals"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
            }}
          >
            <div
              style={{
                flex: '1',
                minWidth: '280px',
                padding: '40px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Lightbulb
                style={{
                  width: '48px',
                  height: '48px',
                  color: '#1A3B00',
                  margin: '0 auto 20px',
                }}
              />
              <h3
                style={{
                  color: '#1A3B00',
                  fontSize: '16px',
                  fontWeight: '400',
                  fontFamily: '"Roboto", system-ui, -apple-system, sans-serif',
                  margin: 0,
                }}
              >
                sustainable goals
              </h3>
            </div>
          </a>

          {/* About Carbon Footprint Card */}
          <a
            href="https://www.conservation.org/stories/what-is-a-carbon-footprint"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
            }}
          >
            <div
              style={{
                flex: '1',
                minWidth: '280px',
                padding: '40px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Info
                style={{
                  width: '48px',
                  height: '48px',
                  color: '#1A3B00',
                  margin: '0 auto 20px',
                }}
              />
              <h3
                style={{
                  color: '#1A3B00',
                  fontSize: '16px',
                  fontWeight: '400',
                  fontFamily: '"Roboto", system-ui, -apple-system, sans-serif',
                  margin: 0,
                }}
              >
                about carbon footprint
              </h3>
            </div>
          </a>

          {/* Getting Involved Card */}
          <a
            href="https://sdgs.un.org/partnerships"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
            }}
          >
            <div
              style={{
                flex: '1',
                minWidth: '280px',
                padding: '40px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Send
                style={{
                  width: '48px',
                  height: '48px',
                  color: '#1A3B00',
                  margin: '0 auto 20px',
                }}
              />
              <h3
                style={{
                  color: '#1A3B00',
                  fontSize: '16px',
                  fontWeight: '400',
                  fontFamily: '"Roboto", system-ui, -apple-system, sans-serif',
                  margin: 0,
                }}
              >
                getting involved
              </h3>
            </div>
          </a>
        </div>
      </div>

      {/* Footer - At bottom of all content with full width */}
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
    </div>
  );
};

export default LandingPage;
