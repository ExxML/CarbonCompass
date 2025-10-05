/**
 * Custom error classes for better error handling
 */

export class GoogleMapsError extends Error {
  constructor(message, status = "UNKNOWN_ERROR") {
    super(message);
    this.name = "GoogleMapsError";
    this.status = status;
  }
}

export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

export class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

/**
 * Error handler for async route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
