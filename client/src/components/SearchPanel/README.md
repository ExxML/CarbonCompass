# SearchPanel Component

Modular search panel component for route planning with Google Places autocomplete, geolocation support, and multi-modal transportation routing.

## 📁 Architecture

```
SearchPanel/
├── index.jsx                     # Main orchestrator (313 lines)
├── components/
│   ├── MinimizedView.jsx         # Collapsed panel view (50 lines)
│   ├── LocationInput.jsx         # Reusable input field (130 lines)
│   ├── PredictionDropdown.jsx    # Autocomplete dropdown (182 lines)
│   ├── RecentSearches.jsx        # Recent searches list (111 lines)
│   └── RouteCard.jsx             # Transportation mode card (174 lines)
├── hooks/
│   ├── useGeolocation.js         # Current location hook (66 lines)
│   ├── useRecentSearches.js      # LocalStorage management (58 lines)
│   ├── useAutocomplete.js        # Google Places API (103 lines)
│   └── useSearchState.js         # Core search logic (174 lines)
└── utils/
    └── styleUtils.js             # CSS injection utilities (53 lines)
```

**Total Lines:** ~1,414 lines (down from 1,487)
**Files Created:** 12 modular files
**Average File Size:** ~118 lines per file
**Largest File:** index.jsx (313 lines)

## 🎯 Components

### Main Component: `index.jsx`

Main orchestrator that composes all sub-components and manages the search workflow.

**Props:**

- `isDarkMode` (boolean): Theme mode
- `onRouteChange` (function): Callback when routes are fetched
- `onClearSearch` (function): Callback when search is cleared
- `onRouteSelect` (function): Callback when a route card is clicked

**Responsibilities:**

- Compose all hooks and components
- Handle directions fetching for multiple transport modes
- Manage panel expansion/minimization state
- Coordinate autocomplete and route display

### UI Components

#### `MinimizedView.jsx`

Compact collapsed view of the search panel.

**Props:**

- `isDarkMode` (boolean): Theme mode
- `onExpand` (function): Callback to expand panel

#### `LocationInput.jsx`

Reusable input field for both origin and destination.

**Props:**

- `type` (string): 'origin' or 'destination'
- `value` (string): Input value
- `onChange` (function): Value change handler
- `onFocus` (function): Focus event handler
- `onBlur` (function): Blur event handler
- `onClear` (function): Clear button handler
- `onKeyDown` (function): Keyboard event handler
- `inputRef` (ref): React ref for input element
- `isDarkMode` (boolean): Theme mode

**Also exports:** `InputSeparator` - Arrow between inputs

#### `PredictionDropdown.jsx`

Autocomplete dropdown with current location option and place predictions.

**Props:**

- `type` (string): 'origin' or 'destination'
- `predictions` (array): List of Google Places predictions
- `currentLocation` (object): { lat, lng } or null
- `isGettingLocation` (boolean): Loading state
- `onPredictionSelect` (function): Prediction click handler
- `onCurrentLocationSelect` (function): Current location click handler
- `isDarkMode` (boolean): Theme mode

#### `RouteCard.jsx`

Individual transportation mode card showing route details and emissions.

**Props:**

- `mode` (string): 'driving', 'transit', 'bicycling', or 'walking'
- `routeData` (object): Route response from API
- `onSelect` (function): Click handler
- `isDarkMode` (boolean): Theme mode

#### `RecentSearches.jsx`

List of recently saved search locations from localStorage.

**Props:**

- `searches` (array): List of recent search objects
- `onSelect` (function): Search item click handler
- `isDarkMode` (boolean): Theme mode

## 🪝 Custom Hooks

### `useGeolocation.js`

Manages browser geolocation functionality.

**Returns:**

```javascript
{
  currentLocation: { lat: number, lng: number } | null,
  isGettingLocation: boolean,
  getCurrentLocation: () => Promise<{lat, lng}>
}
```

**Features:**

- High accuracy positioning
- Comprehensive error handling
- Permission status handling
- 10s timeout

### `useRecentSearches.js`

Manages recent searches in localStorage.

**Returns:**

```javascript
{
  recentSearches: Array<{ id, name, address }>,
  addToRecentSearches: (search) => void
}
```

**Features:**

- Loads from localStorage on mount
- Maintains max 10 recent searches
- Deduplicates by name
- Provides default sample searches

### `useAutocomplete.js`

Google Places autocomplete service integration.

**Returns:**

```javascript
{
  originPredictions: Array,
  destinationPredictions: Array,
  fetchOriginPredictions: (value) => void,
  fetchDestinationPredictions: (value) => void,
  clearOriginPredictions: () => void,
  clearDestinationPredictions: () => void,
  autocompleteService: AutocompleteService | null
}
```

**Features:**

- Separate prediction lists for origin/destination
- Geocode and establishment types
- Error handling for API failures

### `useSearchState.js`

Core search state management with debouncing and handlers.

**Parameters:**

```javascript
{
  fetchOriginPredictions: function,
  fetchDestinationPredictions: function,
  clearOriginPredictions: function,
  clearDestinationPredictions: function,
  onClearSearch: function
}
```

**Returns:**

```javascript
{
  // State
  isMinimized: boolean,
  origin: string,
  destination: string,
  isOriginFocused: boolean,
  isDestinationFocused: boolean,
  allRoutesData: object,

  // Refs
  originInputRef: ref,
  destinationInputRef: ref,
  originDebounceRef: ref,
  destinationDebounceRef: ref,

  // Setters
  setIsMinimized: function,
  setOrigin: function,
  setDestination: function,
  setIsOriginFocused: function,
  setIsDestinationFocused: function,
  setAllRoutesData: function,

  // Handlers
  clearSearch: function,
  handleOriginChange: function,
  handleDestinationChange: function,
  handleOriginSelect: function,
  handleDestinationSelect: function,
  handleCurrentLocationSelect: function,
  handleRecentSearchSelect: function
}
```

**Features:**

- 300ms debounced autocomplete
- Clear search functionality
- Route data management
- Input focus state tracking
- Prediction selection handlers

## 🛠️ Utilities

### `styleUtils.js`

Dynamic CSS injection for input placeholder styling.

**Functions:**

- `injectPlaceholderStyles(isDarkMode)`: Inject or update placeholder styles
- `removePlaceholderStyles()`: Remove styles on unmount
- `generateStyleContent(color)`: Generate CSS string (internal)

## 📊 Data Flow

```
User Input → useSearchState → useAutocomplete → PredictionDropdown
                ↓                                      ↓
          Debounced fetch                      User Selects
                ↓                                      ↓
         Google Places API ←─────────────────────────┘
                ↓
         Update State
                ↓
    handleGetDirections (index.jsx)
                ↓
         useDirections hook
                ↓
    Fetch all 4 transport modes
                ↓
         setAllRoutesData
                ↓
    Render RouteCards (4 modes)
```

## 🎨 Styling

All components use **inline styles** for consistency with the rest of the application:

- Glassmorphism effects (backdrop-filter, rgba backgrounds)
- Roboto font family throughout
- Consistent hover/focus states
- Responsive sizing via `useResponsive` hook
- Dark mode support

## 🔄 Backward Compatibility

The `index.jsx` file is exported as the default component, maintaining 100% backward compatibility:

```javascript
// Old import (still works)
import SearchPanel from './components/SearchPanel.jsx';

// New import (also works)
import SearchPanel from './components/SearchPanel';
```

No changes needed in parent components!

## 🚀 Usage Example

```javascript
import SearchPanel from './components/SearchPanel';

function App() {
  const handleRouteChange = (routesData) => {
    console.log('Routes updated:', routesData);
  };

  const handleRouteSelect = (mode, routeData) => {
    console.log('Selected route:', mode, routeData);
  };

  return (
    <SearchPanel
      isDarkMode={false}
      onRouteChange={handleRouteChange}
      onClearSearch={() => console.log('Search cleared')}
      onRouteSelect={handleRouteSelect}
    />
  );
}
```

## ✅ Benefits of Modularization

1. **Maintainability**: Each component has a single, clear responsibility
2. **Reusability**: `LocationInput`, `RouteCard`, etc. can be used elsewhere
3. **Testability**: Smaller units are easier to unit test
4. **Readability**: ~100-180 lines per file vs 1,487 lines monolithic
5. **Separation of Concerns**: UI, logic, and utilities in separate files
6. **Type Safety**: Clear prop interfaces for each component
7. **Performance**: Potential for better code splitting

## 🔍 SOLID Principles Applied

- **Single Responsibility**: Each component/hook has one clear purpose
- **Open/Closed**: Components accept props for extension without modification
- **Liskov Substitution**: `LocationInput` works for both origin and destination
- **Interface Segregation**: Hooks return only what's needed
- **Dependency Inversion**: Components depend on abstractions (props) not concrete implementations

---

_Refactored from 1,487-line monolithic file to 12 modular files averaging ~118 lines each._
