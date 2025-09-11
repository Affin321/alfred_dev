# alfred_ Widget Sandbox

A comprehensive development environment for building and testing widgets for the alfred_ dashboard platform.

## Overview

This repository provides external developers with a production-like environment to create, test, and validate widgets before integration into the main alfred_ platform. The sandbox includes a responsive grid layout, theme support, and all the core components needed for widget development.

## Features

- **Interactive Grid Layout**: Full drag-and-drop widget positioning with react-grid-layout
- **Theme Support**: Toggle between light and dark modes to test widget appearance
- **Production Styling**: Uses the same CSS system and design patterns as the main alfred_ platform
- **Responsive Testing**: Automatically adapts to different screen sizes and breakpoints
- **Mock Services**: Local data persistence without requiring backend connections
- **Developer Tools**: Real-time breakpoint display, widget count tracking, and debugging info

## Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/connorfata/alfred_dev.git
cd alfred_dev

# Install dependencies
npm install

# Start the development server
npm run dev
```

The sandbox will open at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## Widget Development

### Creating a New Widget

1. **Copy the Sample Widget**: Use `src/components/widgets/SampleWidget` as your starting template
2. **Define Types**: Create a `types.ts` file with your widget's configuration interface
3. **Implement Component**: Build your widget following the established patterns
4. **Register Widget**: Add your widget to the registry in `src/components/widgets/index.ts`

### Widget Structure

```
src/components/widgets/YourWidget/
├── index.tsx          # Main widget component
├── types.ts           # TypeScript interfaces
└── README.md          # Widget documentation
```

### Key Patterns

- **Widget Container**: Use the `.widget-container` class for consistent styling
- **Drag Handle**: Add `.widget-drag-handle` class to draggable areas
- **Settings Button**: Include `.settings-button` class for configuration controls
- **Theme Support**: Use CSS custom properties for light/dark mode compatibility

### Widget Props Interface

```typescript
interface WidgetProps<T = Record<string, unknown>> {
  width: number;           // Grid units wide
  height: number;          // Grid units tall
  config?: T & {
    onDelete?: () => void;
    onUpdate?: (config: Record<string, unknown>) => void;
  };
}
```

## Architecture

### Core Components

- **App.tsx**: Main sandbox interface with grid layout
- **Widget Registry**: Central registry for all available widgets
- **Mock Sync Service**: Local storage service mimicking production data persistence
- **UI Components**: Consistent design system components

### Styling System

The sandbox uses Tailwind CSS v4 with custom CSS properties for theming:

- CSS custom properties for consistent theming
- Production-matched border radius and spacing
- Sophisticated interaction animations
- Responsive breakpoint handling

### Grid System

Built on `react-grid-layout` with these breakpoints:
- `lg`: 1200px+ (12 columns)
- `md`: 996px+ (10 columns)  
- `sm`: 768px+ (6 columns)
- `xs`: 480px+ (4 columns)
- `xxs`: <480px (2 columns)

## Testing Your Widget

1. **Add to Registry**: Register your widget in the main index file
2. **Start Sandbox**: Launch the development server
3. **Add Widget**: Click "Add Widget" to test your component
4. **Test Interactions**: Verify drag, resize, and settings functionality
5. **Theme Testing**: Toggle between light/dark modes
6. **Responsive Testing**: Resize browser to test different breakpoints

## Production Integration

Widgets developed in this sandbox are designed to be compatible with the main alfred_ platform. The sandbox mirrors production patterns for:

- Component architecture
- Styling methodology  
- Data management
- User interactions
- Theme systems

## Documentation

Additional documentation can be found in the `docs/` directory:

- `WIDGET_DEVELOPMENT_RULES.md` - Development guidelines and best practices
- `WIDGET_CHECKLIST.md` - Pre-submission checklist
- `COMPONENT_LIBRARY.md` - Available UI components
- `SAMPLE_WIDGET_GUIDE.md` - Detailed walkthrough of the sample widget

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-widget`)
3. Commit your changes (`git commit -am 'Add new widget'`)
4. Push to the branch (`git push origin feature/your-widget`)
5. Create a Pull Request

## Technology Stack

- **React 18** - Component framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling system
- **react-grid-layout** - Drag and drop grid
- **Vite** - Build tool and dev server
- **Radix UI** - Accessible component primitives

## Support

For questions about widget development or sandbox usage:

- Create an issue in this repository
- Check the documentation in the `docs/` folder
- Reference the sample widget implementation

## License

This project is licensed under the MIT License - see the LICENSE file for details.
The sandbox itself is open source, but widgets developed for alfred_ must comply with the alfred_ platform's terms of service and guidelines.
