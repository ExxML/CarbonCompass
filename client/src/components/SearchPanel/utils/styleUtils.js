/**
 * Utility functions for managing dynamic styles in SearchPanel
 * Handles placeholder color injection based on theme
 */

const STYLE_ID = 'search-panel-placeholder-styles';

/**
 * Inject placeholder styles for search inputs
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
export const injectPlaceholderStyles = (isDarkMode) => {
  const placeholderColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const existingStyle = document.getElementById(STYLE_ID);

  if (existingStyle) {
    // Update existing styles
    existingStyle.textContent = generateStyleContent(placeholderColor);
    return;
  }

  // Create new style element
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = generateStyleContent(placeholderColor);
  document.head.appendChild(style);
};

/**
 * Remove placeholder styles from document
 */
export const removePlaceholderStyles = () => {
  const styleElement = document.getElementById(STYLE_ID);
  if (styleElement) {
    styleElement.remove();
  }
};

/**
 * Generate CSS content for placeholder styles
 * @param {string} color - Placeholder color
 * @returns {string} CSS content
 */
const generateStyleContent = (color) => {
  return `
    .search-input-origin::placeholder,
    .search-input-destination::placeholder {
      color: ${color};
      opacity: 1;
    }
  `;
};
