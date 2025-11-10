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
  const [isMinimized, setIsMinimized] = useState(false);

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
    <div
      style={{
        position: 'fixed',
        bottom: isMobile ? '8px' : '16px',
        left: isMobile ? '8px' : '16px',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: isMobile ? '12px' : '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: isMobile ? '100%' : `${getPanelWidth(384)}px`,
        }}
      >
        {/* Header */}
        <Header isDarkMode={isDarkMode} onMinimize={() => setIsMinimized(true)} />

        {/* Content */}
        <div style={{ padding: '16px' }}>
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
          <div style={{ margin: '10px 0 8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />

          {/* Info Text */}
          <div
            style={{
              fontSize: '10px',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              textAlign: 'center',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            By choosing eco-friendly transport, you&apos;re making a difference! 🌱
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonPanel;
