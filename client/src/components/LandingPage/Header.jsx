import logo_1 from '../../assets/LOGO_1.png';

/**
 * Header Component
 * Displays the navigation header with logo and navigation links
 */
const Header = ({ onNavigateToSection }) => {
  return (
    <header className="absolute top-5 left-1/2 -translate-x-1/2 text-[#1A3B00] text-2xl font-normal flex flex-row items-center justify-center gap-[200px] font-['Roboto'] z-10 whitespace-nowrap w-auto min-w-max py-2 px-2.5">
      {/* Logo */}
      <img
        src={logo_1}
        alt="Logo"
        className="w-[150px] h-[150px] flex-shrink-0"
      />
      <p
        onClick={() => onNavigateToSection('gyi-section')}
        className="m-0 flex-shrink-0 cursor-pointer transition-colors duration-300 hover:text-[#0d5f2b]"
      >
        compass
      </p>
      <p
        onClick={() => onNavigateToSection('about-carbon-section')}
        className="m-0 flex-shrink-0 cursor-pointer transition-colors duration-300 hover:text-[#0d5f2b]"
      >
        about us
      </p>
      <p
        onClick={() => onNavigateToSection('gyi-section')}
        className="m-0 flex-shrink-0 cursor-pointer transition-colors duration-300 hover:text-[#0d5f2b]"
      >
        getting involved
      </p>
    </header>
  );
};

export default Header;
