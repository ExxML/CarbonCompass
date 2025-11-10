# LandingPage Component

## Overview

Modular landing page component following SOLID principles. Each section is isolated into its own file with a single responsibility.

## Structure

```
LandingPage/
├── index.jsx           # Main orchestrator component
├── Header.jsx          # Navigation header with logo and links
├── HeroSection.jsx     # Hero section with CTA button
├── AboutSection.jsx    # Features and information cards
└── Footer.jsx          # Footer with links and team info
```

## Components

### `index.jsx` - Main Landing Page

- **Responsibility**: Orchestrates all sections and provides scroll functionality
- **Props**:
  - `onNavigateToMap`: Function to navigate to map view
- **Exports**: `LandingPage` (default)

### `Header.jsx`

- **Responsibility**: Navigation header with logo and scroll links
- **Props**:
  - `onNavigateToSection`: Function to scroll to specific section
- **Exports**: `Header` (default)

### `HeroSection.jsx`

- **Responsibility**: Main hero section with call-to-action
- **Props**:
  - `onNavigateToMap`: Function to navigate to map view
- **Exports**: `HeroSection` (default)

### `AboutSection.jsx`

- **Responsibility**: Information about carbon footprint with feature cards
- **Props**: None (self-contained)
- **Exports**: `AboutSection` (default)
- **Internal Components**:
  - `FeatureCard`: Reusable card component for features

### `Footer.jsx`

- **Responsibility**: Footer with logo, repository link, and team information
- **Props**: None (self-contained)
- **Exports**: `Footer` (default)

## Usage

```jsx
import LandingPage from './components/LandingPage';

function App() {
  const handleNavigateToMap = () => {
    // Navigate to map view
  };

  return <LandingPage onNavigateToMap={handleNavigateToMap} />;
}
```

## Design Principles

1. **Single Responsibility**: Each component handles one specific section
2. **Composition**: Main component composes smaller components
3. **Reusability**: `FeatureCard` demonstrates component reusability
4. **Separation of Concerns**: Styling, logic, and structure are well-separated
5. **Maintainability**: Easy to modify individual sections without affecting others

## Benefits

- ✅ Easier to test individual components
- ✅ Better code organization and readability
- ✅ Simpler to maintain and extend
- ✅ Reduced file size per component
- ✅ Clear component hierarchy
