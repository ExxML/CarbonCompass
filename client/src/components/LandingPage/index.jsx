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
      className="min-h-screen w-screen bg-center bg-cover bg-no-repeat bg-fixed flex flex-col items-center justify-start pt-[180px] relative m-0 box-border overflow-auto"
      style={{ backgroundImage: `url(${background_0})` }}
    >
      <Header onNavigateToSection={scrollToSection} />
      <HeroSection onNavigateToMap={onNavigateToMap} />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
