# CarbonPanel Module

Modular, maintainable Carbon Impact panel component following SOLID principles.

## Overview

**Original**: 350 lines in one file
**Refactored**: 6 files with clear separation of concerns

## Structure

```
CarbonPanel/
├── index.jsx                    # Main orchestrator (149 lines)
├── components/
│   ├── MinimizedView.jsx       # Collapsed panel state (58 lines)
│   ├── Header.jsx              # Panel header with minimize (55 lines)
│   ├── TotalSaved.jsx          # Large CO₂ savings display (40 lines)
│   └── CarbonMetric.jsx        # Reusable metric card (46 lines)
├── utils/
│   └── metricConfig.js         # Metric styling configuration (32 lines)
└── README.md                   # This file
```

## Components

### `index.jsx` - Main Orchestrator

The main component that composes all sub-components and manages state.

**Props:**

- `isDarkMode` (boolean): Dark mode toggle

**State:**

- `isMinimized` (boolean): Panel minimize/expand state

**Data:**

- `carbonData` (object): Carbon impact statistics
  - `totalSaved` (number): Total CO₂ saved in kg
  - `equivalentTrees` (number): Equivalent trees planted
  - `percentReduction` (number): Percentage reduction
  - `lastTripSavings` (number): Last trip CO₂ savings

**Example:**

```jsx
import CarbonPanel from './components/CarbonPanel';

<CarbonPanel isDarkMode={false} />;
```

### `MinimizedView.jsx`

Compact collapsed state showing only total CO₂ saved.

**Props:**

- `carbonData` (object): Carbon statistics
- `isDarkMode` (boolean): Theme mode
- `isMobile` (boolean): Mobile layout flag
- `onExpand` (function): Callback to expand panel

**Features:**

- Hover animations (lift and border highlight)
- Click to expand
- Glassmorphism styling

### `Header.jsx`

Panel header with title and minimize button.

**Props:**

- `isDarkMode` (boolean): Theme mode
- `onMinimize` (function): Callback to minimize panel

**Features:**

- Leaf icon branding
- "Carbon Impact" title
- X button with hover effect

### `TotalSaved.jsx`

Large display of total CO₂ savings.

**Props:**

- `totalSaved` (number): CO₂ saved in kg
- `isDarkMode` (boolean): Theme mode
- `isMobile` (boolean): Mobile layout flag

**Features:**

- Large 32px numeric display
- "kg" unit suffix
- "CO₂ Saved" label
- Responsive padding (mobile vs desktop)
- Right border (desktop only)

### `CarbonMetric.jsx`

Reusable metric card displaying icon, value, and label.

**Props:**

- `icon` (Component): Lucide icon component
- `value` (string/number): Metric value
- `label` (string): Metric label
- `bgColor` (string): Background color
- `borderColor` (string): Border color
- `iconColor` (string): Icon color
- `isDarkMode` (boolean): Theme mode

**Features:**

- Pill-shaped design
- Icon + value + label layout
- Flexible for any metric type
- Consistent 16px icon size

**Usage:**

```jsx
<CarbonMetric
  icon={TrendingDown}
  value="18%"
  label="Reduce"
  bgColor="rgba(16, 185, 129, 0.15)"
  borderColor="rgba(16, 185, 129, 0.3)"
  iconColor="#10b981"
  isDarkMode={false}
/>
```

## Utilities

### `metricConfig.js`

Configuration helper for different metric types.

**Function: `getMetricConfig(type)`**

Returns styling configuration for metric types:

- `'reduction'` - Percentage reduction (green, TrendingDown icon)
- `'trees'` - Equivalent trees (darker green, TreePine icon)
- `'trip'` - Last trip savings (blue, Car icon)

**Returns:**

```javascript
{
  icon: Component,      // Lucide icon component
  bgColor: string,      // Background color with opacity
  borderColor: string,  // Border color with opacity
  iconColor: string,    // Solid icon color
  label: string         // Display label
}
```

**Example:**

```javascript
import { getMetricConfig } from './utils/metricConfig';

const reductionConfig = getMetricConfig('reduction');
// {
//   icon: TrendingDown,
//   bgColor: 'rgba(16, 185, 129, 0.15)',
//   borderColor: 'rgba(16, 185, 129, 0.3)',
//   iconColor: '#10b981',
//   label: 'Reduce'
// }
```

## Styling

All components use inline styles for:

- Glassmorphism effects (backdrop blur, transparency)
- Responsive layouts (mobile vs desktop)
- Dark mode support
- Smooth animations and transitions

**Design System Colors:**

- **Reduction**: Green (#10b981) - environmental impact
- **Trees**: Dark green (#16a34a) - nature connection
- **Trip**: Blue (#2563eb) - travel/journey

## Data Flow

```
CarbonPanel (index.jsx)
├── carbonData (static mock data)
├── isMinimized (state)
└── Components receive data via props
    ├── MinimizedView: carbonData, isDarkMode, isMobile, onExpand
    ├── Header: isDarkMode, onMinimize
    ├── TotalSaved: totalSaved, isDarkMode, isMobile
    └── CarbonMetric (×3): metric-specific props from config
```

## Responsive Behavior

**Mobile (`isMobile: true`):**

- Full width panels
- Smaller margins (8px vs 16px)
- Wrapped metric cards
- 100% width TotalSaved (no border)
- Compact padding

**Desktop (`isMobile: false`):**

- Fixed width panels (384px default)
- Larger margins (16px)
- Horizontal metric layout
- TotalSaved with right border
- Spacious padding

## Metrics Displayed

1. **Total CO₂ Saved** (large display)
   - Primary metric
   - Left section with border separator

2. **Reduction** (pill metric)
   - Percentage reduction
   - Green accent
   - TrendingDown icon

3. **Trees** (pill metric)
   - Equivalent trees planted
   - Dark green accent
   - TreePine icon

4. **Last Trip** (pill metric)
   - Most recent trip savings
   - Blue accent
   - Car icon

## Future Enhancements

### Easy Extensions

1. **Real Data Integration**
   - Replace mock data with API/state
   - Add loading/error states
   - Real-time updates

2. **New Metrics**
   - Add more metric types to `metricConfig.js`
   - Use `CarbonMetric` component (already reusable)
   - Example: water saved, distance traveled, etc.

3. **Interactive Features**
   - Click metrics for detailed breakdown
   - Historical data charts
   - Goal setting and tracking

4. **Animations**
   - Number counting animations
   - Progress bars
   - Celebration effects for milestones

## Testing Strategy

### Unit Tests

```javascript
// Test metric configuration
import { getMetricConfig } from './utils/metricConfig';

test('returns correct config for reduction type', () => {
  const config = getMetricConfig('reduction');
  expect(config.label).toBe('Reduce');
  expect(config.iconColor).toBe('#10b981');
});
```

### Component Tests

```javascript
// Test CarbonMetric rendering
import { render } from '@testing-library/react';
import CarbonMetric from './components/CarbonMetric';
import { TrendingDown } from 'lucide-react';

test('renders metric with correct value', () => {
  const { getByText } = render(
    <CarbonMetric
      icon={TrendingDown}
      value="18%"
      label="Reduce"
      bgColor="rgba(16, 185, 129, 0.15)"
      borderColor="rgba(16, 185, 129, 0.3)"
      iconColor="#10b981"
      isDarkMode={false}
    />
  );
  expect(getByText('18%')).toBeInTheDocument();
  expect(getByText('Reduce')).toBeInTheDocument();
});
```

### Integration Tests

```javascript
// Test panel minimize/expand
import { render, fireEvent } from '@testing-library/react';
import CarbonPanel from './index';

test('minimizes and expands panel', () => {
  const { getByText, queryByText } = render(<CarbonPanel />);

  // Should show full panel initially
  expect(getByText('Carbon Impact')).toBeInTheDocument();

  // Click minimize
  const minimizeBtn = getByText('✕').closest('button');
  fireEvent.click(minimizeBtn);

  // Should show minimized view
  expect(queryByText('Carbon Impact')).not.toBeInTheDocument();
  expect(getByText(/kg CO₂/)).toBeInTheDocument();
});
```

## SOLID Principles

✅ **Single Responsibility**

- Each component has one job
- MinimizedView: collapsed state
- Header: title and minimize
- TotalSaved: main metric display
- CarbonMetric: reusable metric card
- metricConfig: styling configuration

✅ **Open/Closed**

- Easy to add new metric types without modifying existing code
- Just add to `metricConfig.js` and use `CarbonMetric`

✅ **Liskov Substitution**

- Components are interchangeable
- CarbonMetric works for any metric type

✅ **Interface Segregation**

- Components receive only needed props
- No fat interfaces

✅ **Dependency Inversion**

- Components depend on props (abstractions)
- No hard-coded dependencies

## Backward Compatibility

✅ **100% Compatible**

```javascript
// Old import still works
import CarbonPanel from './components/CarbonPanel';

// Same API, same behavior
<CarbonPanel isDarkMode={false} />;
```

The `index.jsx` file ensures existing imports continue working without any code changes required in other files.

## File Statistics

| File              | Lines   | Responsibility       |
| ----------------- | ------- | -------------------- |
| index.jsx         | 149     | Main orchestrator    |
| MinimizedView.jsx | 58      | Collapsed state      |
| Header.jsx        | 55      | Panel header         |
| TotalSaved.jsx    | 40      | Large metric display |
| CarbonMetric.jsx  | 46      | Reusable metric card |
| metricConfig.js   | 32      | Metric configuration |
| **Total**         | **380** | **6 modular files**  |

**Original**: 350 lines in 1 file
**Refactored**: 380 lines in 6 files (+9% for better structure)
**Average**: 63 lines per file

The slight line increase is due to proper separation of concerns and documentation - well worth the improved maintainability!
