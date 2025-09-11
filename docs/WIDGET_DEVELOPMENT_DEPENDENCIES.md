# Dependencies for Widget Development

## Core Framework Dependencies

### React & TypeScript (Required)
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "~5.7.2"
}
```

### UI Component Library (Required)
All widgets must use the provided shadcn/ui components built on Radix UI:

```json
{
  "@radix-ui/react-avatar": "^1.1.3",
  "@radix-ui/react-checkbox": "^1.1.4",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.6",
  "@radix-ui/react-label": "^2.1.2",
  "@radix-ui/react-popover": "^1.1.14",
  "@radix-ui/react-select": "^2.1.6",
  "@radix-ui/react-separator": "^1.1.2",
  "@radix-ui/react-switch": "^1.1.3",
  "@radix-ui/react-tabs": "^1.1.3",
  "@radix-ui/react-tooltip": "^1.1.8"
}
```

### Styling (Required)
```json
{
  "tailwindcss": "^4.0.12",
  "tailwind-merge": "^3.0.2",
  "tailwindcss-animate": "^1.0.7",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1"
}
```

### Icons & Notifications (Required)
```json
{
  "lucide-react": "^0.479.0",
  "sonner": "^2.0.1"
}
```

## Development Tools (Recommended)

### TypeScript Configuration
```json
{
  "@types/react": "^19.1.8",
  "@types/react-dom": "^19.0.4",
  "@types/node": "^22.13.10"
}
```

### Development Setup
```json
{
  "vite": "^6.3.5",
  "@vitejs/plugin-react": "^4.3.4",
  "eslint": "^9.22.0",
  "typescript-eslint": "^8.24.1"
}
```

## Optional Widget-Specific Dependencies

### Date Handling
```json
{
  "date-fns": "^4.1.0",
  "date-fns-tz": "^3.2.0"
}
```

### Animations (if needed)
```json
{
  "framer-motion": "^12.16.0"
}
```

### Canvas/Confetti Effects (if needed)
```json
{
  "canvas-confetti": "^1.9.3",
  "@types/canvas-confetti": "^1.9.0"
}
```

### Text Processing (if needed)
```json
{
  "sanitize-html": "^2.14.0",
  "@types/sanitize-html": "^2.13.0"
}
```

### Command Menu (if building command interfaces)
```json
{
  "cmdk": "^1.1.1"
}
```

## Database & External Services

**Note**: The platform provides database connectivity and sync services. You don't need to install these directly:
- Database access is handled through the provided sync service
- Authentication is managed by the platform
- External API calls should be made through provided utilities

## Development Environment Setup

### Minimum Requirements
- Node.js 18+ or Bun (recommended)
- TypeScript 5.7+
- Modern browser with ES2022 support

### Recommended VS Code Extensions
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ESLint
- Prettier

### TypeScript Configuration
Your tsconfig should include:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## What You DON'T Need

The platform provides these services, so you don't need to install:
- `@supabase/supabase-js` - Database access is provided
- `react-router-dom` - Navigation is handled by platform
- `react-grid-layout` - Widget layout is managed by platform
- Authentication libraries - Auth is managed by platform

## Testing Your Widget

### Recommended Testing Setup
```json
{
  "vitest": "^latest",
  "@testing-library/react": "^latest",
  "@testing-library/jest-dom": "^latest"
}
```

### Basic Test Example
```typescript
import { render, screen } from '@testing-library/react';
import { YourWidget } from './index';

test('widget renders correctly', () => {
  render(<YourWidget config={mockConfig} width={3} height={3} />);
  expect(screen.getByText('Your Widget Title')).toBeInTheDocument();
});
```

## Package Manager

We recommend using **Bun** for package management:
```bash
bun install
bun dev
bun build
```

But npm/yarn will also work:
```bash
npm install
npm run dev
npm run build
```