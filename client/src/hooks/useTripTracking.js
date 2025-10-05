import { useState, useEffect, useCallback } from 'react';

export const useTripTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tripProgress, setTripProgress] = useState(null);
  const [_routeData, setRouteData] = useState(null);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Dynamic ETA tracking
  const [previousLocation, setPreviousLocation] = useState(null);
  const [movementHistory, setMovementHistory] = useState([]);
  const [currentSpeed, setCurrentSpeed] = useState(null);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((point1, point2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.lat * Math.PI) / 180;
    const φ2 = (point2.lat * Math.PI) / 180;
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }, []);

  // Decode polyline points from route data
  const decodePolyline = useCallback((encodedPolyline) => {
    if (!encodedPolyline || typeof encodedPolyline !== 'string') {
      console.warn('Invalid polyline data provided');
      return [];
    }

    const points = [];
    let index = 0;
    const len = encodedPolyline.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encodedPolyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encodedPolyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        lat: lat / 1e5,
        lng: lng / 1e5,
      });
    }
    return points;
  }, []);

  // Calculate dynamic ETA based on current speed and remaining distance
  const calculateDynamicETA = useCallback((remainingDistance, currentSpeed, movementHistory) => {
    if (!remainingDistance || remainingDistance <= 0) {
      return {
        remainingTime: 0,
        eta: new Date(),
        estimatedSpeed: 0,
      };
    }

    // Calculate estimated speed from movement history or use current speed
    let estimatedSpeed = 0;

    if (movementHistory && movementHistory.length > 0) {
      // Use average speed from recent movements
      const totalDistance = movementHistory.reduce((sum, movement) => sum + movement.distance, 0);
      const totalTime = movementHistory.reduce((sum, movement) => sum + movement.duration, 0);
      estimatedSpeed = totalTime > 0 ? totalDistance / totalTime : 0; // m/s
    } else if (currentSpeed && currentSpeed > 0) {
      estimatedSpeed = currentSpeed; // m/s
    } else {
      // Fallback to walking speed
      estimatedSpeed = 1.4; // m/s (average walking speed)
    }

    // Ensure minimum reasonable speed
    if (estimatedSpeed <= 0) {
      estimatedSpeed = 1.0; // 1 m/s fallback
    }

    // Calculate remaining time in seconds
    const remainingTime = remainingDistance / estimatedSpeed;

    // Calculate ETA
    const eta = new Date(Date.now() + remainingTime * 1000);

    return {
      remainingTime,
      eta,
      estimatedSpeed,
    };
  }, []);

  // Calculate trip progress based on current location and route
  const calculateTripProgress = useCallback(
    (currentPos, routeData) => {
      if (!currentPos || !routeData) return null;

      // Check if routeData has the expected structure - handle both backend and Google API formats
      let polylineData = null;

      // Try different polyline data locations with better Google Maps API support
      if (routeData.points) {
        polylineData = routeData.points; // Backend format
      } else if (routeData.overview_polyline?.points) {
        polylineData = routeData.overview_polyline.points; // Google API direct format
      } else if (routeData.polyline) {
        // Google API sometimes puts polyline directly on route
        polylineData = routeData.polyline;
      } else if (routeData.routes?.[0]?.overview_polyline?.points) {
        polylineData = routeData.routes[0].overview_polyline.points; // Google API nested format
      } else if (routeData.legs?.[0]?.steps) {
        // Extract from steps if overview_polyline not available
        const allPoints = [];
        routeData.legs[0].steps.forEach((step) => {
          if (step.polyline?.points) {
            allPoints.push(...decodePolyline(step.polyline.points));
          }
        });
        if (allPoints.length > 0) {
          const points = allPoints;
          // Continue with processing using the extracted points
          if (points.length === 0) return null;
          // Process the extracted points inline
          if (points.length === 0) return null;

          // Find closest point on route to current position
          let closestPointIndex = 0;
          let minDistance = Infinity;

          points.forEach((point, index) => {
            const distance = calculateDistance(currentPos, point);
            if (distance < minDistance) {
              minDistance = distance;
              closestPointIndex = index;
            }
          });

          // Calculate total route distance
          let totalDistance = 0;
          for (let i = 0; i < points.length - 1; i++) {
            totalDistance += calculateDistance(points[i], points[i + 1]);
          }

          // Calculate distance traveled
          let traveledDistance = 0;
          for (let i = 0; i < closestPointIndex; i++) {
            if (i < points.length - 1) {
              traveledDistance += calculateDistance(points[i], points[i + 1]);
            }
          }

          // Calculate progress percentage
          const progressPercentage =
            totalDistance > 0 ? (traveledDistance / totalDistance) * 100 : 0;
          const remainingDistance = totalDistance - traveledDistance;

          // Estimate remaining time (assuming average speed of 50 km/h for now)
          const averageSpeed = 50 / 3.6; // Convert km/h to m/s
          const remainingTime = remainingDistance / averageSpeed;

          // Calculate ETA
          const eta = new Date(Date.now() + remainingTime * 1000);

          return {
            progressPercentage: Math.min(Math.max(progressPercentage, 0), 100),
            totalDistance,
            traveledDistance,
            remainingDistance,
            remainingTime,
            eta,
            closestPointIndex,
            distanceToRoute: minDistance,
          };
        }
      }

      if (!polylineData) {
        console.warn('Route data missing polyline information.');
        console.warn('Available keys:', Object.keys(routeData));
        console.warn('Checking specific paths:');
        console.warn('- routeData.points:', !!routeData.points);
        console.warn(
          '- routeData.overview_polyline?.points:',
          !!routeData.overview_polyline?.points
        );
        console.warn('- routeData.polyline:', !!routeData.polyline);
        console.warn('- routeData.legs[0]?.steps:', routeData.legs?.[0]?.steps?.length || 0);
        console.warn('Full route data structure:', routeData);
        return null;
      }
      const points = decodePolyline(polylineData);
      if (points.length === 0) return null;

      // Find closest point on route to current position
      let closestPointIndex = 0;
      let minDistance = Infinity;

      points.forEach((point, index) => {
        const distance = calculateDistance(currentPos, point);
        if (distance < minDistance) {
          minDistance = distance;
          closestPointIndex = index;
        }
      });

      // Calculate total route distance
      let totalDistance = 0;
      for (let i = 0; i < points.length - 1; i++) {
        totalDistance += calculateDistance(points[i], points[i + 1]);
      }

      // Calculate distance traveled
      let traveledDistance = 0;
      for (let i = 0; i < closestPointIndex; i++) {
        if (i < points.length - 1) {
          traveledDistance += calculateDistance(points[i], points[i + 1]);
        }
      }

      // Calculate progress percentage
      const progressPercentage = totalDistance > 0 ? (traveledDistance / totalDistance) * 100 : 0;
      const remainingDistance = totalDistance - traveledDistance;

      // Calculate dynamic ETA based on actual movement speed
      const { remainingTime, eta, estimatedSpeed } = calculateDynamicETA(
        remainingDistance,
        currentSpeed,
        movementHistory
      );

      return {
        progressPercentage: Math.min(Math.max(progressPercentage, 0), 100),
        totalDistance,
        traveledDistance,
        remainingDistance,
        remainingTime,
        eta,
        closestPointIndex,
        distanceToRoute: minDistance,
        estimatedSpeed, // Current estimated speed in m/s
        speedKmh: estimatedSpeed * 3.6, // Speed in km/h for display
      };
    },
    [calculateDistance, decodePolyline, calculateDynamicETA, currentSpeed, movementHistory]
  );

  // Validate route data synchronously before tracking
  const validateRouteData = useCallback((directions) => {
    if (!directions) {
      console.error('No directions provided');
      return false;
    }

    // Handle different API response formats
    let route = null;
    if (directions.routes && directions.routes.length > 0) {
      route = directions.routes[0]; // Google Maps API format
    } else if (directions.overview_polyline) {
      route = directions; // Direct route format
    } else {
      console.error('Invalid directions structure:', directions);
      return false;
    }

    // Check for polyline data availability
    const hasPolyline = !!(
      route.points ||
      route.overview_polyline?.points ||
      route.polyline ||
      (route.legs?.[0]?.steps?.length > 0 &&
        route.legs[0].steps.some((step) => step.polyline?.points))
    );

    if (!hasPolyline) {
      console.error('Route missing polyline data. Route structure:', route);
      return false;
    }

    console.log('Route validation passed. Available polyline sources:', {
      points: !!route.points,
      overview_polyline: !!route.overview_polyline?.points,
      polyline: !!route.polyline,
      steps: route.legs?.[0]?.steps?.length || 0,
    });

    return true;
  }, []);

  // Start tracking user location
  const startTracking = useCallback(
    (directions) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser');
        return;
      }

      // Validate route data first
      if (!validateRouteData(directions)) {
        setError('Invalid or incomplete route data');
        return;
      }

      // Extract route from directions
      const route = directions.routes?.[0] || directions;
      setRouteData(route);
      setIsTracking(true);
      setError(null);

      console.log('Starting trip tracking with validated route:', route);

      const id = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now(),
            speed: position.coords.speed, // GPS speed if available
          };

          // Calculate movement speed if we have a previous location
          if (previousLocation) {
            const distance = calculateDistance(previousLocation, location);
            const timeDiff = (location.timestamp - previousLocation.timestamp) / 1000; // seconds

            if (timeDiff > 0 && distance > 0) {
              const speed = distance / timeDiff; // m/s

              // Update movement history (keep last 10 movements)
              setMovementHistory((prev) => {
                const newHistory = [...prev, { distance, duration: timeDiff, speed }];
                return newHistory.slice(-10); // Keep only last 10
              });

              // Use GPS speed if available and reasonable, otherwise calculated speed
              const actualSpeed = location.speed && location.speed > 0 ? location.speed : speed;
              setCurrentSpeed(actualSpeed);
            }
          }

          setPreviousLocation(location);
          setCurrentLocation(location);

          // Calculate progress using the stored route data
          const progress = calculateTripProgress(location, route);
          setTripProgress(progress);

          console.log('Location updated:', location);
          console.log('Trip progress:', progress);
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Location tracking failed';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }

          setError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000, // Cache for 30 seconds
        }
      );

      setWatchId(id);
    },
    [calculateTripProgress, validateRouteData, calculateDistance, previousLocation]
  );

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    setTripProgress(null);
    setCurrentLocation(null);
    setRouteData(null);
    setError(null);
  }, [watchId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    isTracking,
    currentLocation,
    tripProgress,
    error,
    startTracking,
    stopTracking,
  };
};
