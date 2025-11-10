# Architecture Overview

## Before Refactoring (High Coupling, Low Cohesion)

```
┌─────────────────────────────────────────────────────────┐
│                    SearchPanel.jsx                       │
│                      (1488 lines)                        │
├─────────────────────────────────────────────────────────┤
│  • Geolocation logic                                     │
│  • Google Places API                                     │
│  • Autocomplete with debouncing                          │
│  • Recent searches management                            │
│  • LocalStorage operations                               │
│  • State management (8+ useState)                        │
│  • UI rendering (all inline styles)                      │
│  • Business logic                                        │
│  • Event handlers                                        │
└─────────────────────────────────────────────────────────┘
         Everything tightly coupled in one file!
```

## After Refactoring (Low Coupling, High Cohesion)

```
                    Application Architecture
                    
┌─────────────────────────────────────────────────────────┐
│                    Component Layer                       │
│              (Presentation & Composition)                │
└─────────────────────────────────────────────────────────┘
                           ↓ uses
┌─────────────────────────────────────────────────────────┐
│                     Hooks Layer                          │
│               (State & Business Logic)                   │
└─────────────────────────────────────────────────────────┘
                           ↓ uses
┌─────────────────────────────────────────────────────────┐
│                   Services Layer                         │
│               (External Interactions)                    │
└─────────────────────────────────────────────────────────┘
                           ↓ uses
┌─────────────────────────────────────────────────────────┐
│                  Constants Layer                         │
│                 (Configuration)                          │
└─────────────────────────────────────────────────────────┘
```

## Detailed Architecture

```
src/
│
├── constants/
│   └── index.js
│       ├── PANEL_DIMENSIONS
│       ├── BREAKPOINTS
│       ├── TRANSPORT_MODES
│       ├── API_CONFIG
│       └── THEME_COLORS
│
├── services/                         ← External API Layer
│   ├── apiService.js
│   │   └── Backend API calls
│   ├── geolocationService.js
│   │   ├── getCurrentLocation()
│   │   ├── formatLocationDisplay()
│   │   └── formatLocationForAPI()
│   └── autocompleteService.js
│       ├── createAutocompleteService()
│       └── fetchPlacePredictions()
│
├── hooks/                            ← Business Logic Layer
│   ├── useLocalStorage.js
│   │   └── Generic localStorage management
│   ├── useRecentSearches.js
│   │   ├── addSearch()
│   │   ├── clearSearches()
│   │   └── createSearchFrom*()
│   ├── useAutocomplete.js
│   │   ├── predictions
│   │   ├── handleInputChange()
│   │   └── clearPredictions()
│   ├── useResponsive.js
│   │   ├── getPanelWidth()
│   │   └── isMobile/isTablet/isDesktop
│   ├── useDirections.js
│   │   └── Route fetching logic
│   ├── useWeatherData.js
│   │   └── Weather API logic
│   └── useTripTracking.js
│       └── Trip tracking logic
│
└── components/                       ← Presentation Layer
    │
    ├── ui/                          ← Shared UI Components
    │   └── SharedComponents.jsx
    │       ├── MinimizedPanel
    │       ├── PanelHeader
    │       ├── IconButton
    │       ├── MetricDisplay
    │       ├── SectionHeader
    │       ├── ErrorBox
    │       ├── SuccessBox
    │       ├── Badge
    │       └── Divider
    │
    ├── search/                      ← Feature Components
    │   ├── LocationInput.jsx
    │   ├── RouteCard.jsx
    │   ├── PredictionList.jsx
    │   ├── RecentSearches.jsx
    │   └── RouteResults.jsx
    │
    ├── weather/
    │   ├── WeatherIcon.jsx
    │   └── WeatherMetric.jsx
    │
    └── [Feature]PanelRefactored.jsx ← Page Components
        ├── Uses shared UI components
        ├── Uses hooks for logic
        └── Uses services for APIs
```

## Component Composition Example

```
┌────────────────────────────────────────┐
│        CarbonPanelRefactored           │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │       PanelHeader                │ │
│  │  (from SharedComponents)         │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │     MetricDisplay                │ │
│  │  • TrendingDown icon             │ │
│  │  • "Reduction" label             │ │
│  │  • "18%" value                   │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │     MetricDisplay                │ │
│  │  • TreePine icon                 │ │
│  │  • "Trees Equivalent" label      │ │
│  │  • "3 trees" value               │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │     MetricDisplay                │ │
│  │  • Car icon                      │ │
│  │  • "Last Trip" label             │ │
│  │  • "0.8 kg" value                │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

## Data Flow Example

```
User Action: Types in search box
         ↓
┌────────────────────────┐
│   LocationInput        │  ← Component (Presentation)
│   onChange triggered   │
└────────────────────────┘
         ↓
┌────────────────────────┐
│   useAutocomplete      │  ← Hook (Business Logic)
│   handleInputChange()  │
│   • Debouncing         │
└────────────────────────┘
         ↓
┌────────────────────────┐
│ autocompleteService    │  ← Service (External API)
│ fetchPlacePredictions()│
└────────────────────────┘
         ↓
┌────────────────────────┐
│   Google Places API    │  ← External System
└────────────────────────┘
         ↓
┌────────────────────────┐
│   predictions state    │  ← State Update
└────────────────────────┘
         ↓
┌────────────────────────┐
│   PredictionList       │  ← Component (Re-render)
│   displays results     │
└────────────────────────┘
```

## Dependency Graph

```
                   [Constants]
                       ↑
                       |
         [Services] ← [Hooks] → [Utils]
                       ↑
                       |
            [UI Components] ← [Styles (Tailwind)]
                       ↑
                       |
              [Page Components]
                       ↑
                       |
                     [App]

Legend:
→ imports from
↑ depends on
```

## Styling Architecture

```
┌─────────────────────────────────────────┐
│          index.css (Global)             │
│                                         │
│  @import 'tailwindcss'                  │
│                                         │
│  CSS Variables                          │
│  • --bg, --surface, --text, etc.        │
│                                         │
│  @layer base {...}                      │
│  • Font, scrollbar, etc.                │
│                                         │
│  @layer components {...}                │
│  • .glass-panel                         │
│  • .glass-input                         │
│  • .btn-primary                         │
│  • .metric-card                         │
│  • ... 30+ reusable classes             │
│                                         │
│  @layer utilities {...}                 │
│  • Custom utility classes               │
│  • Animations                           │
└─────────────────────────────────────────┘
             ↓ used by
┌─────────────────────────────────────────┐
│         Components                      │
│  <div className="glass-panel p-4">      │
│    <div className="metric-card">        │
│      <button className="btn-primary">   │
└─────────────────────────────────────────┘
```

## Comparison: Component Sizes

```
Before Refactoring:
┌─────────────────────┐
│   SearchPanel.jsx   │
│    1488 lines       │  ← Monolithic
│                     │
│                     │
│                     │
└─────────────────────┘

After Refactoring:
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Location  │ │ Route    │ │Prediction│ │ Recent   │
│Input     │ │ Card     │ │ List     │ │ Searches │
│ 50 lines │ │ 70 lines │ │ 90 lines │ │ 80 lines │  ← Modular
└──────────┘ └──────────┘ └──────────┘ └──────────┘
     +          +            +            +
┌──────────┐ ┌──────────┐
│ Route    │ │Search    │
│ Results  │ │ Panel    │
│ 50 lines │ │200 lines │
└──────────┘ └──────────┘

Total: ~540 lines across 6 focused files
vs 1488 lines in 1 monolithic file
= 64% reduction + much better organization!
```

## Reusability Diagram

```
              SharedComponents.jsx
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ↓             ↓             ↓
  CarbonPanel  WeatherPanel  TripProgressPanel
        │             │             │
        └─────────────┼─────────────┘
                      │
            Used by all panels!
            
Example:
• PanelHeader: Used in 5+ components
• MetricDisplay: Used in 3+ components
• MinimizedPanel: Used in 4+ components
• ErrorBox/SuccessBox: Used everywhere

Before: Each panel had its own implementation
After: One implementation, reused everywhere
```

## Testing Strategy

```
┌─────────────────────────────────────────┐
│            Unit Tests                   │
│                                         │
│  Services                               │
│  • geolocationService.test.js           │
│  • autocompleteService.test.js          │
│                                         │
│  Hooks                                  │
│  • useLocalStorage.test.js              │
│  • useRecentSearches.test.js            │
│  • useAutocomplete.test.js              │
│                                         │
│  Utils                                  │
│  • tripTrackingUtils.test.js            │
│  • decodePolyline.test.js               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        Component Tests                  │
│                                         │
│  UI Components                          │
│  • LocationInput.test.jsx               │
│  • RouteCard.test.jsx                   │
│  • PredictionList.test.jsx              │
│                                         │
│  Shared Components                      │
│  • SharedComponents.test.jsx            │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      Integration Tests                  │
│                                         │
│  • SearchPanel.test.jsx                 │
│  • CarbonPanel.test.jsx                 │
│  • WeatherPanel.test.jsx                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         E2E Tests                       │
│                                         │
│  • User flows                           │
│  • Full app functionality               │
└─────────────────────────────────────────┘
```

## SOLID Principles Visualization

```
Single Responsibility Principle
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Service A   │  │  Service B   │  │  Service C   │
│  One task    │  │  One task    │  │  One task    │
└──────────────┘  └──────────────┘  └──────────────┘

Open/Closed Principle
┌──────────────────────┐
│   BaseComponent      │
│   (closed for mod)   │
└──────────────────────┘
         ↑
         │ extends via props
┌──────────────────────┐
│   ExtendedComponent  │
│   (open for ext)     │
└──────────────────────┘

Liskov Substitution
┌──────────┐     ┌──────────┐
│ Button A │ ←→  │ Button B │  Can be swapped
└──────────┘     └──────────┘

Interface Segregation
Component needs:     Gets exactly:
┌──────────────┐   ┌──────────────┐
│ - prop1      │   │ - prop1      │
│ - prop2      │ = │ - prop2      │
└──────────────┘   └──────────────┘
(Not forced to receive unused props)

Dependency Inversion
┌──────────────┐
│  Component   │
└──────────────┘
       ↓ depends on
┌──────────────┐
│   Hook       │ ← Abstract interface
└──────────────┘
       ↓ uses
┌──────────────┐
│   Service    │ ← Concrete implementation
└──────────────┘
```

## Summary

The refactored architecture provides:
- ✅ Clear separation of concerns
- ✅ Reusable components and utilities
- ✅ Easy to test and maintain
- ✅ Scalable structure
- ✅ SOLID principles throughout
- ✅ Low coupling, high cohesion

Each layer has a specific responsibility and communicates through well-defined interfaces!
