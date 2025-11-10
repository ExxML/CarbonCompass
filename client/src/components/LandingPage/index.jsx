import background_0 from '../../assets/background_0.png';
import Header from './Header';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import Footer from './Footer';

/**
 * Landing Page Component
 * Main entry point - orchestrates all landing page sections
 * Following Single Responsibility Principle - delegates to specialized components
 */
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
      <Header onNavigateToSection={scrollToSection} />
      <HeroSection onNavigateToMap={onNavigateToMap} />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
