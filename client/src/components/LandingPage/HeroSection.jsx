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
      className="relative w-[1440px] h-[665px] flex flex-col items-center justify-center mt-0 max-w-[90vw] z-10"
    >
      {/* Background map image */}
      <div
        className="absolute top-0 left-0 right-0 h-[665px] bg-cover bg-center bg-no-repeat opacity-90 z-[1] rounded-[44px] shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
        style={{ backgroundImage: `url(${map_behind})` }}
      />

      {/* GYI Image */}
      <img
        src={gyi}
        alt="Logo"
        className="w-[960px] h-auto flex-shrink-0 z-[2] relative max-w-[90vw]"
      />

      {/* CTA Button - Centered and positioned lower */}
      <button
        onClick={onNavigateToMap}
        className="absolute left-1/2 bottom-[150px] -translate-x-1/2 bg-gradient-to-br from-emerald-500 to-emerald-600 border-none rounded-[50px] px-20 py-4 text-lg font-semibold text-white cursor-pointer flex items-center gap-3 transition-all duration-300 shadow-[0_10px_30px_rgba(16,185,129,0.3)] font-[system-ui] z-[3] hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)]"
      >
        <Navigation className="w-5 h-5" />
        Find Your Carbon Footprint
      </button>
    </div>
  );
};

export default HeroSection;
