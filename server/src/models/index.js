import Route from './Route.js';

/**
 * RouteRequest - Simple validation schema for route requests
 * This is a basic object structure - in a real application you might use
 * a more sophisticated validation library like Joi or Zod
 */
const RouteRequest = {
    origin: '',
    destination: '',
    userId: null
};

export { Route, RouteRequest };