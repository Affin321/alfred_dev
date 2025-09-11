# Widget Development Rules & Principles

This document outlines the mandatory rules and guiding principles for developing widgets in the alfred_ ecosystem.

## Mandatory Rules

### TypeScript Standards

**Rule 1: No `any` Types**
- Never use the `any` type in TypeScript
- Define proper interfaces and types for all data structures
- Use type guards and validation functions for runtime type checking

```typescript
// ❌ Wrong
function processData(data: any): any {
  return data.someProperty;
}

// ✅ Correct
interface DataStructure {
  someProperty: string;
}

function processData(data: DataStructure): string {
  return data.someProperty;
}
```

**Rule 2: Dead Code Elimination**
- All defined objects, interfaces, and functions must be used
- If code is not used, it must be deleted
- Regular cleanup of unused imports and declarations is required

```typescript
// ❌ Wrong - unused interface
interface UnusedInterface {
  prop: string;
}

export interface WidgetData {
  items: string[];
}

// ✅ Correct - only define what you use
export interface WidgetData {
  items: string[];
}
```

### Code Quality Standards

**Rule 3: Explicit Return Types**
- All functions must have explicit return type annotations
- No implicit `any` returns allowed

```typescript
// ❌ Wrong
function getData() {
  return fetchFromAPI();
}

// ✅ Correct
function getData(): Promise<WidgetData> {
  return fetchFromAPI();
}
```

**Rule 4: Proper Error Handling**
- All async operations must include error handling
- Errors must be typed and handled gracefully
- Never silently fail operations

```typescript
// ❌ Wrong
async function saveData(data: WidgetData) {
  await api.save(data);
}

// ✅ Correct
async function saveData(data: WidgetData): Promise<SaveResult> {
  try {
    await api.save(data);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

**Rule 5: Consistent File Structure**
Every widget must include these exact files:
- `types.ts` - All TypeScript interfaces and types
- `index.tsx` - React component implementation
- `[widgetName]Sync.ts` - Data persistence provider
- `README.ts` - Widget metadata for marketplace
- `icon.png` - 64x64px widget icon
- `public/widget-screenshots/.png` - Showcasing the widget for the widget selector


**Rule 6: Required Interface Properties**
All widget configurations must include:
- `onUpdate?: (config: Config) => void`
- `onDelete?: () => void`
- `widgetId?: string`
- `[key: string]: unknown` (extensibility signature)

## Guiding Principles

### User Experience Principles

**Principle 1: Be Irreplacable to the User's Daily Routine**
Widgets should strive to become irreplaceable to the user's daily routine.

- Provide unique value that users can't easily get elsewhere
- Integrate seamlessly into daily workflows
- Offer functionality that saves significant time or effort
- Create habitual usage patterns through consistent value delivery

*Example: A weather widget that learns your commute times and proactively shows conditions for when you leave*

**Principle 2: Constantly Reduce Friction to Action**
Widgets should be designed for speed, enabling user's to prioritize the information they see rather than searching for it.

- Minimize clicks and interactions required to complete tasks
- Provide contextual information without requiring navigation
- Anticipate user needs and surface relevant data proactively
- Optimize for speed of interaction over feature completeness

*Example: A todo widget that shows next actions immediately rather than requiring drill-down navigation*

**Principle 3: Information by Function Over Information by Brand**
Widgets should be designed as applications addressing information for a specific function rather than an integration providing information from a specific brand.

- Focus on the core task or information need, not brand representation
- Aggregate and synthesize information rather than displaying raw brand feeds
- Prioritize user goals over platform marketing or engagement metrics
- Content quality matters more than source loyalty

*Example: Instead of a "Twitter Widget" that shows a Twitter timeline, create a "Social Mentions Widget" that aggregates mentions of your company/keywords across Twitter, Reddit, LinkedIn, and news sites, presenting only actionable insights rather than endless scroll feeds.*

### Technical Excellence Principles

**Principle 4: Graceful Degradation**
- Always provide fallback functionality when external services fail
- Maintain core functionality even in offline scenarios
- Use localStorage as a reliability layer for critical data
- Display meaningful error states with recovery options

**Principle 5: Performance First**
- Optimize for fast initial load times
- Use efficient data structures and algorithms
- Implement proper memoization for expensive calculations
- Minimize re-renders through proper React patterns

**Principle 6: Responsive by Design**
- Support all widget sizes from 2x2 to 4x4+
- Adapt functionality and UI based on available space
- Maintain usability across different screen densities
- Test on mobile and desktop viewports

**Principle 7: Privacy and Security**
- Validate all user inputs to prevent XSS attacks
- Store only necessary data, minimize data collection
- Use secure defaults for all configuration options
- Implement proper data cleanup and deletion

### Development Principles

**Principle 8: Type Safety First**
- Design with types before writing implementation
- Use type-driven development approaches
- Prefer compile-time safety over runtime flexibility
- Document complex types with clear comments

**Principle 9: Testable Architecture**
- Write code that can be easily unit tested
- Separate business logic from UI components
- Use dependency injection for external services
- Provide clear interfaces for mocking in tests

**Principle 10: Consistent Patterns**
- Follow established widget development patterns
- Use provided UI components when available
- Maintain consistent error handling approaches
- Implement standard lifecycle hooks properly

**Principle 11: Documentation Excellence**
- Write clear, actionable README files
- Document all public interfaces and their usage
- Provide examples for complex functionality
- Keep documentation updated with code changes

## Best Practices

### Data Management
- Always save to localStorage first, then sync to external storage
- Implement data validation at multiple layers
- Use proper serialization for Date objects and complex types
- Provide data export/import functionality for user portability

### UI/UX Design
- Use loading states for all async operations
- Provide empty states with clear calls-to-action
- Implement proper error boundaries and recovery flows
- Follow platform design system and theming

### Performance Optimization
- Debounce expensive operations (saves, API calls)
- Use React.memo for components with expensive renders
- Implement proper cleanup in useEffect hooks
- Avoid memory leaks through proper event listener management

### Code Organization
- Keep components focused on single responsibilities
- Extract custom hooks for reusable logic
- Use proper file organization within widget directories
- Maintain clear separation between data, UI, and business logic

## Enforcement

These rules and principles are enforced through:
- TypeScript compiler strict mode settings
- Code review processes
- Automated linting and testing
- Performance monitoring and user feedback analysis

Violations of mandatory rules will result in widget rejection. Adherence to principles will be evaluated during the review process and contributes to widget marketplace featuring and promotion.

## Examples of Rule Violations

### Common `any` Usage Violations
```typescript
// ❌ Wrong - using any for API responses
const response: any = await fetch('/api/data');

// ✅ Correct - proper typing
interface APIResponse {
  data: WidgetItem[];
  status: 'success' | 'error';
}
const response: APIResponse = await fetch('/api/data').then(r => r.json());
```

### Common Dead Code Violations
```typescript
// ❌ Wrong - unused interface and import
import { SomeUnusedUtility } from './utils';

interface UnusedConfig {
  setting: string;
}

export interface WidgetProps {
  config: ConfigType;
}

// ✅ Correct - only what's needed
export interface WidgetProps {
  config: ConfigType;
}
```

Following these rules and principles ensures widgets are reliable, performant, and provide exceptional user experiences while maintaining code quality and platform consistency.