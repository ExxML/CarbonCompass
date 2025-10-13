import { useState } from 'react';
import MapView from './components/MapView';
import LandingPage from './components/LandingPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' or 'map'

  const navigateToMap = () => {
    setCurrentPage('map');
  };

  const navigateToLanding = () => {
    setCurrentPage('landing');
  };

  if (currentPage === 'landing') {
    return <LandingPage onNavigateToMap={navigateToMap} />;
  }

  return <MapView onNavigateToLanding={navigateToLanding} />;
}
