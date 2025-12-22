/**
 * Refactored Carbon Panel Component
 * Following SOLID principles:
 * - Single Responsibility: Manages carbon impact display and state
 * - Uses composition with smaller UI components
 * - Separates concerns: data vs presentation
 */

import { useState } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import MinimizedView from './components/MinimizedView';
import Header from './components/Header';
import TotalSaved from './components/TotalSaved';
import CarbonMetric from './components/CarbonMetric';
import { getMetricConfig } from './utils/metricConfig';

const CarbonPanel = ({ isDarkMode = false }) => {
  const { isMobile, getPanelWidth } = useResponsive();
  const [isMinimized, setIsMinimized] = useState(true);

  const carbonData = {
    totalSaved: 2.4,
    equivalentTrees: 3,
    percentReduction: 18,
    lastTripSavings: 0.8,
  };

  // Minimized state
  if (isMinimized) {
    return (
      <MinimizedView
        carbonData={carbonData}
        isDarkMode={isDarkMode}
        isMobile={isMobile}
        onExpand={() => setIsMinimized(false)}
      />
    );
  }

  // Get metric configurations
  const reductionConfig = getMetricConfig('reduction');
  const treesConfig = getMetricConfig('trees');
  const tripConfig = getMetricConfig('trip');

  return (
    <div className={`fixed z-[9999] ${isMobile ? 'bottom-2 left-2' : 'bottom-4 left-4'}`}>
      <div
        className={`bg-white/10 backdrop-blur-[15px] ${isMobile ? 'rounded-xl' : 'rounded-2xl'} border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]`}
        style={{
          width: isMobile ? '100%' : `${getPanelWidth(384)}px`,
        }}
      >
        {/* Header */}
        <Header isDarkMode={isDarkMode} onMinimize={() => setIsMinimized(true)} />

        {/* Content */}
        <div className="p-4">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              justifyContent: 'space-between',
            }}
          >
            {/* Total Saved - Left Section */}
            <TotalSaved
              totalSaved={carbonData.totalSaved}
              isDarkMode={isDarkMode}
              isMobile={isMobile}
            />

            {/* Metrics - Right Section (Horizontal Pills) */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flex: '1',
                flexWrap: 'nowrap',
                alignItems: 'stretch',
                justifyContent: 'space-evenly',
                maxWidth: '100%',
                minWidth: '0',
              }}
            >
              {/* Reduction Metric */}
              <CarbonMetric
                icon={reductionConfig.icon}
                value={`${carbonData.percentReduction}%`}
                label={reductionConfig.label}
                bgColor={reductionConfig.bgColor}
                borderColor={reductionConfig.borderColor}
                iconColor={reductionConfig.iconColor}
                isDarkMode={isDarkMode}
              />

              {/* Trees Metric */}
              <CarbonMetric
                icon={treesConfig.icon}
                value={carbonData.equivalentTrees}
                label={treesConfig.label}
                bgColor={treesConfig.bgColor}
                borderColor={treesConfig.borderColor}
                iconColor={treesConfig.iconColor}
                isDarkMode={isDarkMode}
              />

              {/* Last Trip Metric */}
              <CarbonMetric
                icon={tripConfig.icon}
                value={`${carbonData.lastTripSavings}kg`}
                label={tripConfig.label}
                bgColor={tripConfig.bgColor}
                borderColor={tripConfig.borderColor}
                iconColor={tripConfig.iconColor}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="my-2.5 mb-2 mt-2.5 border-t border-white/10" />

          {/* Info Text */}
          <div
            className={`font-roboto text-center text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            By choosing eco-friendly transport, you&apos;re making a difference! 🌱
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonPanel;
