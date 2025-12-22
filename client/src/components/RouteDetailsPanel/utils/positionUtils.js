/**
 * Utility functions for calculating panel position
 */

/**
 * Calculate position adjacent to search panel
 * @param {boolean} isMobile - Whether on mobile device
 * @param {function} getPanelWidth - Function to get responsive panel width
 * @returns {object} Position styles
 */
export const getAdjacentPosition = (isMobile, getPanelWidth) => {
  const padding = isMobile ? 8 : 16;
  const searchPanelWidth = getPanelWidth(384); // SearchPanel width
  const gap = 12; // Gap between panels

  if (isMobile) {
    // On mobile, stack vertically below search panel
    return {
      top: 'auto',
      bottom: padding,
      left: padding,
      right: 'auto',
    };
  } else {
    // On desktop, position right beside search panel
    return {
      top: padding,
      left: padding + searchPanelWidth + gap,
      right: 'auto',
      bottom: 'auto',
    };
  }
};
