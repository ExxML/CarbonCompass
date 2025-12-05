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
      className="no-underline text-inherit block"
    >
      <div className="flex-1 min-w-[280px] py-10 px-5 bg-white/80 rounded-2xl text-center shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
        <IconComponent className="w-12 h-12 text-[#1A3B00] mx-auto mb-5" />
        <h3 className="text-[#1A3B00] text-base font-normal font-['Roboto'] m-0">
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
      className="max-w-[1200px] w-[90%] text-center mt-[90px] mb-20 py-[60px] px-10 self-center z-10 relative"
    >
      <h2 className="text-[#1A3B00] text-5xl font-normal font-['Roboto'] m-0 mb-5 leading-[0.9] text-center">
        <span className="italic text-4xl font-['Garamond']">
          take a moment to
        </span>
        <br />
        <span className="font-['Microsoft_Himalaya'] font-normal text-[100px] tracking-[-3px]">
          understand your steps.
        </span>
      </h2>

      <div className="text-[#666] text-base font-normal font-['Roboto'] leading-none mb-10 text-center">
        <p className="m-0 mb-2.5">
          <span className="italic">/kärben kom·pəs/</span> · carbon compass ·{' '}
          <span className="italic">noun</span>
        </p>
        <p className="m-0">
          Navigate through the city with a deeper understanding of every trip you make.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="flex justify-between gap-10 mt-[60px] flex-wrap">
        {features.map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} title={feature.title} href={feature.href} />
        ))}
      </div>
    </div>
  );
};

export default AboutSection;
