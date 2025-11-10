# Component Refactoring Guide

## Step-by-Step Process for Refactoring Any Component

This guide shows you how to apply the refactoring pattern to any component in your codebase.

## The Refactoring Pattern

### Step 1: Identify Responsibilities

Look at your component and identify distinct responsibilities:
- **Data fetching/API calls** → Move to services or hooks
- **State management** → Keep in component or extract to custom hook
- **Business logic** → Extract to utility functions or hooks
- **Presentation/UI** → Break into smaller presentational components

### Step 2: Extract Services

**Before:**
```javascript
// Inside component
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error)
    );
  });
};
```

**After:**
```javascript
// src/services/geolocationService.js
export const getCurrentLocation = () => {
  // ... implementation
};

// In component
import { getCurrentLocation } from '../services/geolocationService';
```

### Step 3: Extract Custom Hooks

**Before:**
```javascript
// Inside component - 50+ lines of state management
const [value, setValue] = useState('');
const [predictions, setPredictions] = useState([]);
const debounceRef = useRef(null);

const handleChange = (newValue) => {
  setValue(newValue);
  if (debounceRef.current) clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => {
    fetchPredictions(newValue);
  }, 500);
};
```

**After:**
```javascript
// src/hooks/useAutocomplete.js
export const useAutocomplete = (service) => {
  // ... all the logic
  return { predictions, handleInputChange, clearPredictions };
};

// In component - 1 line
const { predictions, handleInputChange } = useAutocomplete(service);
```

### Step 4: Extract UI Components

**Before (Mixed in one component):**
```javascript
return (
  <div style={{ ... tons of inline styles ... }}>
    <div style={{ ... header styles ... }}>
      <Icon />
      <span>Title</span>
      <button onClick={onClose}>X</button>
    </div>
    <div style={{ ... content ... }}>
      {/* content */}
    </div>
  </div>
);
```

**After:**
```javascript
// Extracted PanelHeader component
return (
  <div className="glass-panel">
    <PanelHeader
      icon={Icon}
      title="Title"
      onClose={onClose}
      isDarkMode={isDarkMode}
    />
    <div className="p-4">
      {/* content */}
    </div>
  </div>
);
```

### Step 5: Replace Inline Styles with Tailwind

**Before:**
```javascript
<div style={{
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(15px)',
  borderRadius: '16px',
  padding: '16px',
  border: '1px solid rgba(255, 255, 255, 0.2)'
}}>
```

**After:**
```javascript
<div className="glass-panel p-4">
```

### Step 6: Use Constants

**Before:**
```javascript
const searchPanelWidth = 384;
const mobileWidth = window.innerWidth < 768 ? 320 : 384;
```

**After:**
```javascript
import { PANEL_DIMENSIONS, BREAKPOINTS } from '../constants';

const width = getPanelWidth(PANEL_DIMENSIONS.BASE_WIDTH);
```

## Complete Example: Refactoring a Panel Component

### BEFORE: Original Component (300+ lines)

```javascript
import React, { useState } from 'react';

const MyPanel = ({ isDarkMode }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [data, setData] = useState(null);

  // Lots of inline styles
  const panelStyle = {
    position: 'fixed',
    top: '16px',
    right: '16px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    width: '384px',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  };

  // Business logic mixed with component
  const fetchData = async () => {
    const response = await fetch('/api/data');
    const json = await response.json();
    setData(json);
  };

  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '12px',
          cursor: 'pointer',
        }}
        onClick={() => setIsMinimized(false)}
      >
        <span style={{ fontSize: '14px', color: isDarkMode ? '#f9fafb' : '#374151' }}>
          Summary
        </span>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <span style={{ fontSize: '16px', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>
          My Panel
        </span>
        <button
          onClick={() => setIsMinimized(true)}
          style={{
            padding: '4px',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          X
        </button>
      </div>
      <div>
        {data ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Metric 1:</span>
              <span style={{ fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                {data.metric1}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Metric 2:</span>
              <span style={{ fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                {data.metric2}
              </span>
            </div>
          </div>
        ) : (
          <button onClick={fetchData}>Load Data</button>
        )}
      </div>
    </div>
  );
};

export default MyPanel;
```

### AFTER: Refactored Component (80 lines)

```javascript
import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { MinimizedPanel, PanelHeader, MetricDisplay } from './ui/SharedComponents';
import { useResponsive } from '../hooks/useResponsive';
import { useMyData } from '../hooks/useMyData'; // Extracted data fetching

const MyPanelRefactored = ({ isDarkMode }) => {
  const { getPanelWidth, isMobile } = useResponsive();
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Data fetching is now in a custom hook
  const { data, loading, fetchData } = useMyData();

  if (isMinimized) {
    return (
      <div className="panel-fixed-right">
        <MinimizedPanel
          icon={Activity}
          label="Summary"
          onClick={() => setIsMinimized(false)}
          isDarkMode={isDarkMode}
        />
      </div>
    );
  }

  return (
    <div className="panel-fixed-right">
      <div
        className={isMobile ? 'glass-panel-mobile' : 'glass-panel'}
        style={{ width: `${getPanelWidth(384)}px`, padding: isMobile ? '12px' : '16px' }}
      >
        <PanelHeader
          icon={Activity}
          title="My Panel"
          onMinimize={() => setIsMinimized(true)}
          isDarkMode={isDarkMode}
        />

        <div className="p-4">
          {data ? (
            <div className="space-y-3">
              <MetricDisplay
                icon={Activity}
                label="Metric 1"
                value={data.metric1}
                color="#10b981"
                isDarkMode={isDarkMode}
              />
              <MetricDisplay
                icon={Activity}
                label="Metric 2"
                value={data.metric2}
                color="#3b82f6"
                isDarkMode={isDarkMode}
              />
            </div>
          ) : (
            <button onClick={fetchData} className="btn-primary w-full" disabled={loading}>
              {loading ? 'Loading...' : 'Load Data'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPanelRefactored;
```

### The Corresponding Hook (`useMyData.js`)

```javascript
import { useState, useCallback } from 'react';
import { apiService } from '../services/apiService';

export const useMyData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getData();
      setData(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, fetchData, clearData };
};
```

## Benefits Comparison

| Aspect | Before | After |
|--------|--------|-------|
| **Lines of Code** | 300+ | 80 (component) + 30 (hook) |
| **Inline Styles** | 100+ lines | 0 lines |
| **Reusability** | None | High |
| **Testability** | Difficult | Easy |
| **Maintainability** | Low | High |
| **Readability** | Complex | Clear |

## Checklist for Refactoring

Use this checklist when refactoring any component:

- [ ] Extract all API calls to services
- [ ] Extract complex state logic to custom hooks
- [ ] Identify reusable UI patterns
- [ ] Replace inline styles with Tailwind classes
- [ ] Use shared components (PanelHeader, MetricDisplay, etc.)
- [ ] Move magic numbers to constants
- [ ] Separate minimized and expanded views
- [ ] Use responsive hooks for dimensions
- [ ] Add proper prop validation
- [ ] Write clear comments
- [ ] Test the refactored component

## Common Patterns

### Pattern 1: Panel with Minimized State
```javascript
if (isMinimized) {
  return (
    <div className="panel-fixed-{position}">
      <MinimizedPanel {...props} onClick={() => setIsMinimized(false)} />
    </div>
  );
}
```

### Pattern 2: Loading State
```javascript
{loading ? (
  <div className="text-center text-gray-400">Loading...</div>
) : error ? (
  <ErrorBox message={error} />
) : (
  <Content />
)}
```

### Pattern 3: Metric Display
```javascript
<div className="space-y-3">
  <MetricDisplay icon={Icon1} label="Label 1" value={value1} color="#10b981" />
  <MetricDisplay icon={Icon2} label="Label 2" value={value2} color="#3b82f6" />
</div>
```

### Pattern 4: Responsive Positioning
```javascript
const { getPanelWidth, isMobile } = useResponsive();

<div className={isMobile ? 'fixed top-2 left-2' : 'panel-fixed-left'}>
  <div
    className={isMobile ? 'glass-panel-mobile' : 'glass-panel'}
    style={{ width: `${getPanelWidth(384)}px` }}
  >
```

## Quick Reference: Shared Components

### MinimizedPanel
```javascript
<MinimizedPanel
  icon={IconComponent}
  label="Text"
  onClick={handleExpand}
  isDarkMode={isDarkMode}
/>
```

### PanelHeader
```javascript
<PanelHeader
  icon={IconComponent}
  title="Panel Title"
  onClose={handleClose}        // or onMinimize
  isDarkMode={isDarkMode}
/>
```

### MetricDisplay
```javascript
<MetricDisplay
  icon={IconComponent}
  label="Metric Name"
  value="100"
  color="#10b981"
  isDarkMode={isDarkMode}
/>
```

### ErrorBox / SuccessBox
```javascript
<ErrorBox message="Error message" />
<SuccessBox title="Success!">Content</SuccessBox>
```

## Tips

1. **Start Small**: Refactor one component at a time
2. **Keep Original**: Don't delete original until tested
3. **Test Frequently**: Test after each refactoring step
4. **Use Examples**: Refer to `*Refactored.jsx` files
5. **Ask Questions**: Check REFACTORING.md for details

## Need Help?

Refer to:
- `REFACTORING.md`: Comprehensive documentation
- `REFACTORING_SUMMARY.md`: Quick overview
- Example refactored components:
  - `CarbonPanelRefactored.jsx`
  - `WeatherPanelRefactored.jsx`
  - `TripProgressPanelRefactored.jsx`
