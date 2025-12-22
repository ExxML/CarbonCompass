import { Github } from 'lucide-react';
import logo_1 from '../../assets/LOGO_1.png';

/**
 * Footer Component
 * Displays footer with logo, repository link, and team info
 */
const Footer = () => {
  return (
    <footer className="mt-[60px] w-screen ml-[calc(-50vw+50%)] bg-[#2a2a2a] py-5 px-[60px] flex justify-between items-center text-white font-['Roboto'] box-border">
      {/* Left side - Logo and Carbon Compass text */}
      <div className="flex items-center gap-5">
        <img
          src={logo_1}
          alt="Carbon Compass Logo"
          className="w-[140px] h-[140px]"
        />
      </div>

      {/* Right side - Repository and team info */}
      <div className="text-right text-[#b0b0b0] text-sm leading-normal">
        <div className="mb-2 text-right">
          <a
            href="https://github.com/ExxML/CarbonCompass"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline font-extrabold text-base inline-flex items-center gap-3"
          >
            <Github className="w-5 h-5" />
            View Source
          </a>
        </div>
        <div className="my-3">Powered by Google LLC ©</div>
        <div>
          <div>Andy Wu, Timothy Mai</div>
          <div>Victor Thai, Johnny Ho</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
