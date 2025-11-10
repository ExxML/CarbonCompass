const GlassCard = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
