# RoutePolyline Component

## Overview

Modular polyline component following SOLID principles. Functionality is separated into specialized files based on responsibility.

## Structure

```
RoutePolyline/
├── index.jsx            # Main component (declarative interface)
├── usePolyline.js       # Custom hook (lifecycle management)
└── polylineManager.js   # Utility functions (business logic)
```

## Architecture

### Layer 1: `index.jsx` - Component Layer

- **Responsibility**: Provides declarative React interface
- **Concerns**: Props validation, component API
- **Exports**: `RoutePolyline` (default)

### Layer 2: `usePolyline.js` - Hook Layer

- **Responsibility**: Manages polyline lifecycle and React integration
- **Concerns**: useEffect, useRef, map integration
- **Exports**: `usePolyline` hook

### Layer 3: `polylineManager.js` - Utility Layer

- **Responsibility**: Pure functions for polyline operations
- **Concerns**: Google Maps API calls, business logic
- **Exports**:
  - `createPolyline`: Creates polyline instance
  - `destroyPolyline`: Removes polyline from map
  - `fitBoundsToPath`: Fits map bounds to path

## API

### RoutePolyline Props

```typescript
{
  path: Array<{lat: number, lng: number}>;  // Required
  strokeColor?: string;                      // Default: '#4285F4'
  strokeOpacity?: number;                    // Default: 1
  strokeWeight?: number;                     // Default: 5
  fit?: boolean;                             // Default: false
  onReady?: (polyline: google.maps.Polyline) => void;
  clickable?: boolean;                       // Default: false
}
```

## Usage

```jsx
import RoutePolyline from './components/RoutePolyline';

function MapView() {
  const [path, setPath] = useState([]);

  return (
    <Map>
      <RoutePolyline
        path={path}
        strokeColor="#10b981"
        strokeWeight={6}
        fit={true}
        onReady={(polyline) => console.log('Polyline ready', polyline)}
      />
    </Map>
  );
}
```

## Design Principles

1. **Single Responsibility**:
   - Component: Interface only
   - Hook: Lifecycle only
   - Utilities: Operations only

2. **Separation of Concerns**:
   - React logic separate from Google Maps logic
   - Side effects isolated in hook
   - Pure functions for testability

3. **Dependency Inversion**:
   - Component depends on hook abstraction
   - Hook depends on utility abstractions
   - Easy to mock for testing

4. **Open/Closed Principle**:
   - Easy to extend without modifying existing code
   - Add new utilities without changing hook
   - Add new options without changing structure

## Testing Strategy

```javascript
// Test utilities (pure functions)
import { createPolyline, fitBoundsToPath } from './polylineManager';

// Test hook in isolation
import { renderHook } from '@testing-library/react-hooks';
import { usePolyline } from './usePolyline';

// Test component integration
import { render } from '@testing-library/react';
import RoutePolyline from './RoutePolyline';
```

## Benefits

- ✅ Highly testable (pure functions, isolated hook)
- ✅ Easy to maintain (clear separation)
- ✅ Reusable utilities (can be used elsewhere)
- ✅ Type-safe with TypeScript (add .d.ts files)
- ✅ Better code organization
- ✅ Easier to debug (smaller files)

## Migration Notes

If you have existing code importing `RoutePolyline.jsx`:

```javascript
// Old import still works:
import RoutePolyline from './components/RoutePolyline';

// New import (same result):
import RoutePolyline from './components/RoutePolyline/index';
```

No changes required to existing code - backward compatible!
