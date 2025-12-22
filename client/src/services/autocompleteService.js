/**
 * Google Places Autocomplete Service
 * Single Responsibility: Handle all Google Places API interactions
 */

/**
 * Creates a Google Places Autocomplete Service instance
 * @param {google.maps.places} placesLib - Google Maps Places library
 * @returns {google.maps.places.AutocompleteService|null}
 */
export const createAutocompleteService = (placesLib) => {
  if (!placesLib || !placesLib.AutocompleteService) {
    console.warn('Places library not available');
    return null;
  }

  try {
    const service = new placesLib.AutocompleteService();
    console.log('AutocompleteService initialized successfully');
    return service;
  } catch (error) {
    console.error('Failed to initialize AutocompleteService:', error);
    return null;
  }
};

/**
 * Fetches place predictions from Google Places API
 * @param {google.maps.places.AutocompleteService} service
 * @param {string} input - User input text
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Array>}
 */
export const fetchPlacePredictions = (service, input, options = {}) => {
  if (!service || !input) {
    return Promise.resolve([]);
  }

  const defaultOptions = {
    componentRestrictions: { country: 'ca' },
    types: ['establishment', 'geocode'],
  };

  return new Promise((resolve) => {
    service.getPlacePredictions(
      {
        input,
        ...defaultOptions,
        ...options,
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          resolve(predictions);
        } else {
          console.warn('Place predictions failed:', status);
          resolve([]);
        }
      }
    );
  });
};

/**
 * Extracts the main text from a prediction
 * @param {Object} prediction - Google Places prediction object
 * @returns {string}
 */
export const getPredictionMainText = (prediction) => {
  return prediction?.structured_formatting?.main_text || prediction?.description || '';
};

/**
 * Extracts the secondary text from a prediction
 * @param {Object} prediction - Google Places prediction object
 * @returns {string}
 */
export const getPredictionSecondaryText = (prediction) => {
  return prediction?.structured_formatting?.secondary_text || '';
};
