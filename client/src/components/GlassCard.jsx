import React from 'react';

const GlassCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
