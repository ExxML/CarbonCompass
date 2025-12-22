/**
 * StyleController Component
 * Manages map styling for light/dark mode
 */

import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

function StyleController({ isDarkMode, darkMapStyles, lightMapStyles }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    console.log('StyleController: Applying styles for', isDarkMode ? 'dark' : 'light', 'mode');
    console.log('Styles array:', isDarkMode ? darkMapStyles : lightMapStyles);

    const styles = isDarkMode ? darkMapStyles : lightMapStyles;

    // Force refresh by clearing styles first, then applying new ones
    map.setOptions({ styles: [] });

    // Use setTimeout to ensure the clear happens before applying new styles
    setTimeout(() => {
      map.setOptions({ styles });
      console.log('Styles applied successfully');
    }, 50);
  }, [map, isDarkMode, darkMapStyles, lightMapStyles]);

  return null;
}

export default StyleController;
