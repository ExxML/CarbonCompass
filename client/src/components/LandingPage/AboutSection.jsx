import { Lightbulb, Info, Send } from 'lucide-react';

/**
 * Feature Card Component
 * Reusable card for displaying features with icons
 */
const FeatureCard = ({ icon, title, href }) => {
  const IconComponent = icon;
  return (
    <a
      href={href}
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
        <IconComponent
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
          {title}
        </h3>
      </div>
    </a>
  );
};

/**
 * About Section Component
 * Contains information about carbon footprint and features
 */
const AboutSection = () => {
  const features = [
    {
      icon: Lightbulb,
      title: 'sustainable goals',
      href: 'https://sdgs.un.org/goals',
    },
    {
      icon: Info,
      title: 'about carbon footprint',
      href: 'https://www.conservation.org/stories/what-is-a-carbon-footprint',
    },
    {
      icon: Send,
      title: 'getting involved',
      href: 'https://www.conservation.org/stories/what-is-a-carbon-footprint',
    },
  ];

  return (
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
        {features.map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} title={feature.title} href={feature.href} />
        ))}
      </div>
    </div>
  );
};

export default AboutSection;
