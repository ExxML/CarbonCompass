/**
 * Utility functions for managing RouteDetailsPanel styles
 * Handles transparent scrollbar injection
 */

const STYLE_ID = 'route-details-transparent-scrollbar';

/**
 * Inject transparent scrollbar styles
 */
export const injectScrollbarStyles = () => {
  // Remove existing style element
  const existingStyle = document.getElementById(STYLE_ID);
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create new style element with transparent scrollbar background
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .transparent-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .transparent-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .transparent-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(107, 114, 128, 0.5);
      border-radius: 4px;
    }
    .transparent-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(107, 114, 128, 0.7);
    }
    .transparent-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(107, 114, 128, 0.5) transparent;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Remove scrollbar styles from document
 */
export const removeScrollbarStyles = () => {
  const styleElement = document.getElementById(STYLE_ID);
  if (styleElement) {
    styleElement.remove();
  }
};
