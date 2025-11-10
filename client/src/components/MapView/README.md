# MapView Module

Refactored map control buttons and map configuration components into reusable, modular components following SOLID principles.

## Overview

**Original**: 543 lines with inline definitions
**Refactored**: 338 lines (-205 lines, -38%) + 5 modular components

## Structure

```
MapView/
├── components/
│   ├── MapButton.jsx         # Reusable glassmorphic button (73 lines)
│   ├── MapControls.jsx       # Button orchestrator (62 lines)
│   ├── TrafficLayer.jsx      # Traffic layer manager (32 lines)
│   ├── ConfigureControls.jsx # Map UI configuration (35 lines)
│   ├── StyleController.jsx   # Light/dark mode styles (34 lines)
│   ├── TransitStopMarkers.jsx # Transit stop markers (49 lines)
│   ├── RoutePolylines.jsx    # Multi-route renderer (38 lines)
│   └── ErrorDisplay.jsx      # Error modal overlay (47 lines)
└── README.md                 # This file

Note: RoutePolylines uses the standalone RoutePolyline component from /components/RoutePolyline/
```

## Components

### UI Control Components

#### `MapButton.jsx` - Reusable Button Component

A highly reusable glassmorphic button with consistent styling and behavior.

**Props:**

- `icon` (Component): Lucide icon component
- `label` (string): Button label text
- `onClick` (function): Click handler
- `isActive` (boolean): Active/inactive state
- `activeColor` (string): Color when active (hex)
- `iconColor` (string): Icon color
- `activeIconColor` (string, optional): Icon color when active
- `position` (number): Vertical position (0, 1, 2...)
- `width` (string): Button width (default: '140px')

**Features:**

- Glassmorphism styling (backdrop blur, transparency)
- Smooth transitions and hover effects
- Consistent spacing (60px between buttons)
- Fixed width for alignment
- Auto-calculated background/border colors from activeColor
- Lift animation on hover

**Example:**

```jsx
<MapButton
  icon={Home}
  label="Home"
  onClick={handleHome}
  isActive={false}
  activeColor="#10b981"
  iconColor="#10b981"
  position={0}
  width="140px"
/>
```

### `MapControls.jsx` - Button Container

Orchestrates all map control buttons in the correct order.

**Props:**

- `onNavigateToLanding` (function, optional): Landing page navigation
- `showTraffic` (boolean): Traffic layer visibility
- `onToggleTraffic` (function): Traffic toggle handler
- `isDarkMode` (boolean): Dark mode state
- `onToggleDarkMode` (function): Dark mode toggle handler

**Button Order:**

1. **Home** (position 0) - Navigate to landing page
2. **Traffic** (position 1) - Toggle traffic layer
3. **Dark Mode** (position 2) - Toggle dark/light mode

**Color Scheme:**

- **Home**: Green (#10b981) - eco-friendly branding
- **Traffic**: Red (#dc2626) when active, gray when inactive
- **Dark Mode**: Dark gray (#1f2937) when active, amber (#f59e0b) when inactive

**Example:**

```jsx
<MapControls
  onNavigateToLanding={() => navigate('/landing')}
  showTraffic={showTraffic}
  onToggleTraffic={() => setShowTraffic(!showTraffic)}
  isDarkMode={isDarkMode}
  onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
/>
```

## Design System

### Button Styling

All buttons share consistent styling:

- **Position**: Fixed top-right corner
- **Spacing**: 60px vertical gap between buttons
- **Width**: 140px (ensures alignment)
- **Padding**: 12px 16px
- **Border Radius**: 12px
- **Backdrop Blur**: 10px
- **Shadow**: 0 8px 32px rgba(0, 0, 0, 0.1)
- **Hover**: Lift by 2px, increased shadow

### Color Themes

**Home Button:**

- Background: rgba(16, 185, 129, 0.15)
- Border: rgba(16, 185, 129, 0.4)
- Icon: #10b981 (green)
- Text: #10b981

**Traffic Button:**

- Active BG: rgba(220, 38, 38, 0.15)
- Active Border: rgba(220, 38, 38, 0.4)
- Active Icon: #dc2626 (red)
- Inactive Icon: #6b7280 (gray)

**Dark Mode Button:**

- Active BG: rgba(31, 41, 55, 0.15)
- Active Border: rgba(31, 41, 55, 0.4)
- Active Icon: #9ca3af (light gray)
- Inactive Icon: #f59e0b (amber)
- Icons: Moon (light mode) / Sun (dark mode)

### Icons

Using Lucide React icons:

- **Home**: Home icon
- **Traffic**: Navigation icon
- **Dark Mode**: Moon (inactive) / Sun (active)

````

All icons are 18px × 18px for consistency.

### Map Configuration Components

#### `TrafficLayer.jsx` - Traffic Layer Manager

Manages Google Maps traffic layer visibility with proper lifecycle management.

**Props:**
- `isVisible` (boolean): Whether traffic layer should be shown

**Features:**
- Automatic cleanup on unmount
- Handles Google Maps API availability
- Toggles traffic layer on/off
- No visual rendering (returns null)

**Example:**
```jsx
<TrafficLayer isVisible={showTraffic} />
````

#### `ConfigureControls.jsx` - Map UI Configuration

Configures Google Maps default UI controls (disables all default controls for custom UI).

**Props:** None

**Features:**

- Disables all default Google Maps UI controls
- Runs once on map initialization
- Ensures clean map canvas for custom controls
- Handles Google Maps API availability

**Disabled Controls:**

- Map type control
- Fullscreen control
- Zoom control
- Street view control
- Rotate control
- Scale control
- Pan control
- Overview map control

**Example:**

```jsx
<ConfigureControls />
```

#### `StyleController.jsx` - Light/Dark Mode Styles

Manages map styling for light and dark mode with smooth transitions.

**Props:**

- `isDarkMode` (boolean): Current theme mode
- `darkMapStyles` (array): Dark mode style configuration
- `lightMapStyles` (array): Light mode style configuration

**Features:**

- Applies custom map styles based on theme
- Forces style refresh for smooth transitions
- Clears existing styles before applying new ones
- Logs style changes for debugging

**Example:**

````jsx
**Example:**
```jsx
<StyleController
  isDarkMode={isDarkMode}
  darkMapStyles={darkMapStyles}
  lightMapStyles={lightMapStyles}
/>
````

#### `TransitStopMarkers.jsx` - Transit Stop Markers

Renders departure and arrival markers for transit routes.

**Props:**

- `transitRoute` (object): Transit route data with steps

**Features:**

- Filters steps for transit details
- Creates SVG markers with transit line colors
- Alternates between departure/arrival stops
- Shows line name in marker
- Tooltip with stop information

**Example:**

```jsx
<TransitStopMarkers transitRoute={allRoutes.transit} />
```

#### `RoutePolylines.jsx` - Multi-Route Renderer

Renders all route polylines with mode-specific colors. Uses the standalone `RoutePolyline` component.

**Props:**

- `allRoutes` (object): Object with routes by mode (driving, transit, bicycling, walking)

**Features:**

- Mode-specific colors (driving: red, transit: blue, bicycling: green, walking: purple)
- Decodes polyline strings automatically
- Fits bounds to first route only
- Consistent stroke weight and opacity

**Mode Colors:**

- Driving: `#dc2626` (red)
- Transit: `#2563eb` (blue)
- Bicycling: `#16a34a` (green)
- Walking: `#7c3aed` (purple)
- Default: `#6b7280` (gray)

**Example:**

```jsx
<RoutePolylines allRoutes={allRoutes} />
```

**Note:** This component uses the standalone `RoutePolyline` component from `/components/RoutePolyline/`, which is a fully modular component with its own hooks and utilities.

#### `ErrorDisplay.jsx` - Error Modal Overlay

Displays error messages in a centered modal with red background.

**Props:**

- `error` (string): Error message to display
- `title` (string): Error title (default: 'Error')

**Features:**

- Only renders if error exists
- Centered modal overlay
- Red background with blur effect
- High z-index (10000)
- Glassmorphism styling

**Example:**

```jsx
<ErrorDisplay error={trackingError} title="Trip Tracking Error" />
```

## Benefits

````

## Benefits

## Benefits

### Before Refactoring

```jsx
{/* 150+ lines of repeated button code */}
<button style={{ ...40 lines of inline styles... }}>
  <Home style={{ width: '16px', height: '16px', color: '#10b981' }} />
  <span style={{ ...15 lines of inline styles... }}>Home</span>
</button>
// Repeated 3x with variations
````

### After Refactoring

```jsx
<MapControls
  onNavigateToLanding={onNavigateToLanding}
  showTraffic={showTraffic}
  onToggleTraffic={() => setShowTraffic(!showTraffic)}
  isDarkMode={isDarkMode}
  onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
/>
```

**Improvements:**

- ✅ **132 fewer lines** in MapView.jsx (-24%)
- ✅ **Consistent styling** across all buttons
- ✅ **Easy to add** new control buttons
- ✅ **Reusable** MapButton component
- ✅ **Better color coordination** with theme
- ✅ **Fixed width** for proper alignment
- ✅ **Correct button order** (Home → Traffic → Dark Mode)

## Usage in MapView.jsx

```jsx
import MapControls from './MapView/components/MapControls';
import TrafficLayer from './MapView/components/TrafficLayer';
import ConfigureControls from './MapView/components/ConfigureControls';
import StyleController from './MapView/components/StyleController';

// Inside Map component
<Map {...mapProps}>
  {/* Map configuration components */}
  <ConfigureControls />
  <StyleController
    isDarkMode={isDarkMode}
    darkMapStyles={darkMapStyles}
    lightMapStyles={lightMapStyles}
  />
  <TrafficLayer isVisible={showTraffic} />

  {/* Your markers, polylines, etc. */}
</Map>;

{
  /* UI control buttons */
}
<MapControls
  onNavigateToLanding={onNavigateToLanding}
  showTraffic={showTraffic}
  onToggleTraffic={() => setShowTraffic(!showTraffic)}
  isDarkMode={isDarkMode}
  onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
/>;
```

## Adding New Buttons

To add a new control button:

1. **Add to MapControls.jsx:**

```jsx
<MapButton
  icon={YourIcon}
  label="Your Label"
  onClick={onYourAction}
  isActive={yourState}
  activeColor="#yourColor"
  iconColor="#yourIconColor"
  position={3} // Next position
/>
```

2. **Add props to MapControls:**

```jsx
const MapControls = ({
  // ... existing props
  yourState,
  onYourAction,
}) => {
```

That's it! The MapButton component handles all styling automatically.

## Responsive Behavior

Buttons maintain consistent positioning:

- **Desktop**: Fixed top-right at 16px from edge
- **Mobile**: Same positioning (may consider stacking in future)
- **Spacing**: 60px vertical gap ensures no overlap

## Future Enhancements

### Easy Additions

1. **Zoom Controls**

```jsx
<MapButton icon={ZoomIn} label="Zoom In" onClick={handleZoomIn} position={3} />
```

2. **Layer Selector**

```jsx
<MapButton icon={Layers} label="Layers" onClick={toggleLayerMenu} position={4} />
```

3. **Compass/Reset**

```jsx
<MapButton icon={Compass} label="Reset View" onClick={resetMapView} position={5} />
```

### Potential Features

- Mobile-responsive stacking
- Keyboard shortcuts
- Tooltips on hover
- Button grouping/panels
- Animation on state change
- Badge indicators (e.g., traffic level)

## Testing Strategy

### Component Tests

```javascript
import { render, fireEvent } from '@testing-library/react';
import MapButton from './MapButton';
import { Home } from 'lucide-react';

test('renders button with correct label', () => {
  const { getByText } = render(
    <MapButton icon={Home} label="Home" onClick={() => {}} position={0} />
  );
  expect(getByText('Home')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <MapButton icon={Home} label="Home" onClick={handleClick} position={0} />
  );
  fireEvent.click(getByText('Home'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Integration Tests

```javascript
test('toggles traffic on button click', () => {
  const { getByText } = render(<MapView />);

  const trafficBtn = getByText('Show Traffic');
  fireEvent.click(trafficBtn);

  expect(getByText('Hide Traffic')).toBeInTheDocument();
});
```

## SOLID Principles

✅ **Single Responsibility**

- MapButton: Renders one button
- MapControls: Manages button group
- Each button has one action

✅ **Open/Closed**

- Easy to add new buttons without modifying MapButton
- Just pass different props

✅ **Liskov Substitution**

- All buttons use same MapButton component
- Consistent interface

✅ **Interface Segregation**

- Clean, minimal props
- Optional props for flexibility

✅ **Dependency Inversion**

- Callbacks passed as props
- No hard-coded logic in components

## File Statistics

| File                   | Lines   | Responsibility            |
| ---------------------- | ------- | ------------------------- |
| MapView.jsx            | 235     | Main map component (-308) |
| MapButton.jsx          | 73      | Reusable button           |
| MapControls.jsx        | 62      | Button orchestrator       |
| TrafficLayer.jsx       | 32      | Traffic layer management  |
| ConfigureControls.jsx  | 35      | Map UI configuration      |
| StyleController.jsx    | 34      | Light/dark mode styles    |
| TransitStopMarkers.jsx | 49      | Transit stop markers      |
| RoutePolylines.jsx     | 38      | Multi-route renderer      |
| ErrorDisplay.jsx       | 47      | Error modal overlay       |
| **Total**              | **605** | **Modular structure**     |

**Impact:**

- Original: 543 lines in MapView.jsx
- Refactored: 235 lines in MapView.jsx + 370 lines in 8 components
- Result: **308 lines removed** from main file (-57%)
- Better organization and maintainability
- Clear separation of concerns (UI controls, map layers, error handling)

**Component Relationships:**

- `RoutePolylines` uses the standalone `RoutePolyline` component from `/components/RoutePolyline/`
- `MapControls` composes multiple `MapButton` components
- All map layer components are independent and can be reused

## Button Order Rationale

**New Order: Home → Traffic → Dark Mode**

1. **Home** (top) - Primary navigation action
2. **Traffic** (middle) - Map data layer toggle
3. **Dark Mode** (bottom) - UI preference setting

This ordering prioritizes:

- Navigation actions first
- Data visualization controls in middle
- UI preferences last
- Most frequently used actions at top
