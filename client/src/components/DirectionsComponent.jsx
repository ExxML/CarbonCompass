import { useState } from 'react';
import { useDirections } from '../hooks/useDirections';

const DirectionsComponent = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelMode, setTravelMode] = useState('driving');

  const {
    directionsData,
    loading,
    error,
    getDirections,
    clearDirections,
    getBestRoute,
    getCarbonEmissions,
    getTotalDistance,
    getTotalDuration,
  } = useDirections();

  const handleGetDirections = async (e) => {
    e.preventDefault();

    if (!origin || !destination) {
      alert('Please enter both origin and destination');
      return;
    }

    try {
      await getDirections({
        origin,
        destination,
        mode: travelMode,
        alternatives: true,
        units: 'metric',
      });
    } catch (err) {
      console.error('Failed to get directions:', err);
    }
  };

  const bestRoute = getBestRoute();
  const carbonEmissions = getCarbonEmissions();
  const distance = getTotalDistance();
  const duration = getTotalDuration();

  return (
    <div className="directions-container">
      <h2>Get Directions</h2>

      {/* Form for input */}
      <form onSubmit={handleGetDirections} className="directions-form">
        <div className="form-group">
          <label>Origin:</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Enter starting point"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Travel Mode:</label>
          <select
            value={travelMode}
            onChange={(e) => setTravelMode(e.target.value)}
            disabled={loading}
          >
            <option value="driving">Driving</option>
            <option value="walking">Walking</option>
            <option value="bicycling">Bicycling</option>
            <option value="transit">Transit</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Getting Directions...' : 'Get Directions'}
          </button>

          {directionsData && (
            <button type="button" onClick={clearDirections}>
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Error display */}
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Results display */}
      {bestRoute && (
        <div className="directions-results">
          <h3>Route Information</h3>

          <div className="route-summary">
            <h4>{bestRoute.summary}</h4>
            <p>
              <strong>From:</strong> {bestRoute.start_address}
            </p>
            <p>
              <strong>To:</strong> {bestRoute.end_address}
            </p>
          </div>

          {distance && (
            <div className="distance-info">
              <p>
                <strong>Distance:</strong> {distance.text}
              </p>
            </div>
          )}

          {duration && (
            <div className="duration-info">
              <p>
                <strong>Duration:</strong> {duration.text}
              </p>
            </div>
          )}

          {carbonEmissions && (
            <div className="carbon-info">
              <h4>Carbon Emissions</h4>
              <p>
                <strong>CO₂ Emissions:</strong> {carbonEmissions.emissions_kg} kg
              </p>
              <p>
                <strong>Travel Mode:</strong> {carbonEmissions.travel_mode}
              </p>
              <p>
                <strong>Distance:</strong> {carbonEmissions.distance_km} km
              </p>
            </div>
          )}

          {/* Show polyline data for map rendering */}
          {bestRoute.polyline && (
            <div className="polyline-info">
              <h4>Route Data</h4>
              <p>Polyline available for map rendering</p>
              <details>
                <summary>View Polyline Data</summary>
                <code>{bestRoute.polyline}</code>
              </details>
            </div>
          )}

          {/* Show all alternative routes */}
          {directionsData.routes.length > 1 && (
            <div className="alternative-routes">
              <h4>Alternative Routes</h4>
              {directionsData.routes.slice(1).map((route, index) => (
                <div key={index} className="alternative-route">
                  <p>
                    <strong>Route {index + 2}:</strong> {route.summary}
                  </p>
                  <p>
                    Distance: {route.distance.text} | Duration: {route.duration.text}
                  </p>
                  <p>CO₂: {route.carbon_emissions.emissions_kg} kg</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DirectionsComponent;
