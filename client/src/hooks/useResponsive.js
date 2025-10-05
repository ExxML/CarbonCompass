import { useState, useEffect } from 'react';

// Mobile-specific positioning for overlapping panels
export const getMobileStackedPosition = (panelIndex = 0, isMobile = false) => {
  if (!isMobile) return {};

  const stackOffset = panelIndex * 60; // Stack panels with 60px offset
  return {
    transform: `translateY(${stackOffset}px)`,
    zIndex: 9999 - panelIndex, // Higher panels get lower z-index
  };
};

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define breakpoints
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;
  const isLargeDesktop = windowSize.width >= 1440;

  // Calculate responsive panel widths
  const getPanelWidth = (baseWidth = 384) => {
    if (isMobile) {
      // On mobile, use most of the screen width with some padding
      return Math.min(windowSize.width - 32, 320);
    } else if (isTablet) {
      // On tablet, use a moderate width
      return Math.min(baseWidth * 0.9, 350);
    } else if (isLargeDesktop) {
      // On large desktop, allow larger panels
      return Math.min(baseWidth * 1.1, 420);
    } else {
      // Desktop default
      return baseWidth;
    }
  };

  // Calculate responsive positioning
  const getResponsivePosition = (position = 'left') => {
    const padding = isMobile ? 8 : 16;

    return {
      top: padding,
      left: position === 'left' ? padding : 'auto',
      right: position === 'right' ? padding : 'auto',
      bottom: 'auto',
    };
  };

  // Calculate grid layout for panels
  const getPanelGridLayout = () => {
    if (isMobile) {
      return {
        columns: 1,
        gap: 8,
        maxHeight: windowSize.height - 100,
      };
    } else if (isTablet) {
      return {
        columns: 2,
        gap: 12,
        maxHeight: windowSize.height - 80,
      };
    } else {
      return {
        columns: 'auto',
        gap: 16,
        maxHeight: windowSize.height - 60,
      };
    }
  };

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    getPanelWidth,
    getResponsivePosition,
    getPanelGridLayout,
  };
};
