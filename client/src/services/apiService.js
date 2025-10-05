/**
 * API service for communicating with the Carbon Compass backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/api`;
  }

  /**
   * Make a request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} - API response
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Get directions between two points
   * @param {Object} params - Direction parameters
   * @param {string} params.origin - Starting point
   * @param {string} params.destination - Ending point
   * @param {string} params.mode - Travel mode (driving, walking, bicycling, transit)
   * @param {Array} params.avoid - Things to avoid (tolls, highways, ferries, indoor)
   * @param {string} params.units - Units (metric, imperial)
   * @param {boolean} params.alternatives - Whether to return alternative routes
   * @returns {Promise<Object>} - Directions data with carbon emissions
   */
  async getDirections(params) {
    return this.request('/directions', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get directions using query parameters (alternative method)
   * @param {Object} params - Direction parameters
   * @returns {Promise<Object>} - Directions data with carbon emissions
   */
  async getDirectionsQuery(params) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return this.request(`/directions?${searchParams.toString()}`);
  }

  /**
   * Calculate carbon emissions for a specific distance and mode
   * @param {number} distance - Distance in kilometers
   * @param {string} mode - Travel mode
   * @returns {Promise<Object>} - Carbon emission data
   */
  async calculateCarbonEmissions(distance, mode = 'driving') {
    return this.request('/directions/carbon', {
      method: 'POST',
      body: JSON.stringify({ distance, mode }),
    });
  }

  /**
   * Health check endpoint
   * @returns {Promise<Object>} - Server health status
   */
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default ApiService;
