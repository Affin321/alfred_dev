# Widget Development Checklist

Use this checklist to ensure you've completed all required steps when creating a new widget for the alfred_ platform.

## Pre-Development Setup

### Database Setup (optional - coordinate with Connor to implement Datatable)
- [ ] Create database table with required columns:
  - `id UUID DEFAULT gen_random_uuid() PRIMARY KEY`
  - `user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
  - `widget_instance_id TEXT NOT NULL DEFAULT 'default'`
  - `widget_type TEXT NOT NULL DEFAULT 'your-widget-name'`
  - `data JSONB NOT NULL`
  - `created_at TIMESTAMPTZ DEFAULT NOW()`
  - `updated_at TIMESTAMPTZ DEFAULT NOW()`
- [ ] Add unique constraint: `UNIQUE (user_id, widget_instance_id)`
- [ ] Enable Row Level Security (RLS): `ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY`
- [ ] Create RLS policy: `"Users can manage their own [widget] data" ON [table_name] FOR ALL USING (auth.uid() = user_id)`

### Edge Function Setup (If Required - also coordinate with Connor if needed)
- [ ] Create Supabase edge function in `supabase/functions/[function-name]/index.ts`
- [ ] Include proper CORS headers for OPTIONS requests
- [ ] Add environment variable configuration (API keys, etc.)
- [ ] Include proper error handling and logging
- [ ] Test function deployment: `supabase functions deploy [function-name]`
- [ ] Set environment variables: `supabase secrets set VARIABLE_NAME=value`

## File Structure Requirements

### Required Files
- [ ] `types.ts` - Complete TypeScript interfaces and type definitions
- [ ] `index.tsx` - React component implementation
- [ ] `[widgetName]Sync.ts` - Data persistence sync provider
- [ ] `README.ts` - Widget metadata for marketplace
- [ ] `icon.png` - 64x64px widget icon (place in public/widget-icons/)
- [ ] `public/widget-screenshots/.png` - Showcasing the widget for the widget selector

### Directory Structure
```
src/components/widgets/YourWidget/
├── components/           # Custom components (optional)
├── hooks/               # Custom hooks (optional)
├── utils/               # Utility functions (optional)
├── types.ts
├── index.tsx
├── [widgetName]Sync.ts
├── README.ts
├── screenshots.png
└── icon.png
```

## TypeScript Implementation

### types.ts Requirements
- [ ] Define main data interface (e.g., `YourWidgetData`)
- [ ] Define configuration interface extending required properties:
  - `onUpdate?: (config: Config) => void`
  - `onDelete?: () => void`
  - `widgetId?: string`
  - `[key: string]: unknown` (extensibility signature)
- [ ] Define component props type extending `WidgetProps<Config>`
- [ ] Create default configuration object
- [ ] Create widget metadata object for registry with:
  - `type: string` (unique identifier)
  - `name: string` (display name)
  - `icon: string` (Lucide icon name)
  - `minWidth: number`
  - `minHeight: number`
  - `defaultWidth: number`
  - `defaultHeight: number`
  - `category: string`
  - `description: string`
- [ ] Include validation helper functions
- [ ] Add serialization/deserialization helpers for Date objects
- [ ] No `any` types used anywhere
- [ ] All functions have explicit return types

### Sync Provider Requirements
- [ ] Extend `BaseWidgetSync` class
- [ ] Implement `getDefaultData()` method
- [ ] Implement `saveData()` method with three-tier persistence
- [ ] Implement `loadData()` method with fallback strategy
- [ ] Implement `migrateData()` method for localStorage → database migration
- [ ] Include proper error handling and logging
- [ ] Register with sync service in constructor
- [ ] Handle data serialization/deserialization properly

### Component Requirements
- [ ] Proper state management with React hooks
- [ ] Loading state with spinner
- [ ] Error state with recovery options
- [ ] Empty state with call-to-action
- [ ] Responsive design for all widget sizes (2x2, 3x3, 4x4+)
- [ ] Settings dialog with save/cancel/delete options
- [ ] Integration with sync service using `syncService.loadWidgetData()` and `syncService.saveWidgetData()`
- [ ] Proper TypeScript types throughout
- [ ] Use provided UI components from component library
- [ ] Include proper ARIA labels and accessibility features
- [ ] Export widget metadata for registry

## Code Quality Standards

### TypeScript Compliance
- [ ] No `any` types used
- [ ] All functions have explicit return types
- [ ] No unused imports, interfaces, or functions
- [ ] Proper error handling with typed errors
- [ ] Input validation and sanitization

### React Best Practices
- [ ] Proper use of `useState`, `useEffect`, `useCallback`, `useMemo`
- [ ] No memory leaks (cleanup in useEffect)
- [ ] Efficient re-rendering (avoid unnecessary renders)
- [ ] Proper event handler patterns
- [ ] Use of React.memo for expensive child components (if needed)

## Testing & Validation

### Manual Testing
- [ ] Widget loads properly in all sizes (2x2, 3x3, 4x4+)
- [ ] Settings can be opened, modified, and saved
- [ ] Data persists after page refresh
- [ ] Works correctly when logged out (localStorage only)
- [ ] Data migrates properly on first login
- [ ] Error states display appropriately
- [ ] Loading states show during async operations
- [ ] Responsive design works on mobile and desktop
- [ ] All interactive elements are accessible via keyboard

### Data Flow Testing
- [ ] Create new data items
- [ ] Update existing data
- [ ] Delete data items
- [ ] Configuration changes persist
- [ ] Data sync works between localStorage and database
- [ ] Error recovery works when database is unavailable

## Documentation

### README.ts Requirements
- [ ] Compelling tagline (one sentence hook)
- [ ] Clear description of what the widget does
- [ ] List of key features (4-8 bullet points)
- [ ] Practical use cases (3-5 specific scenarios)
- [ ] Setup time estimate
- [ ] Requirements list
- [ ] Version number
- [ ] Recent updates list
- [ ] Developer information
- [ ] Pricing information
- [ ] Relevant tags for discovery
- [ ] Last updated date

### Code Documentation
- [ ] Clear comments for complex business logic
- [ ] JSDoc comments for public interfaces
- [ ] Inline documentation for non-obvious code
- [ ] Type definitions are self-documenting

## Security & Privacy

### Data Security
- [ ] Input validation prevents XSS attacks
- [ ] Data size limits prevent storage abuse
- [ ] Sensitive data is not logged or exposed
- [ ] API keys are stored in environment variables only

### Privacy Compliance
- [ ] Only necessary user data is collected
- [ ] Data can be exported/deleted via settings
- [ ] No tracking without user consent
- [ ] Clear data usage in README

## Performance Optimization

### React Performance
- [ ] Expensive calculations are memoized
- [ ] Event handlers are properly memoized
- [ ] Child components use React.memo when beneficial
- [ ] No unnecessary re-renders

### Data Management
- [ ] Database operations are debounced appropriately
- [ ] Old/unnecessary data is cleaned up
- [ ] Local storage usage is reasonable
- [ ] API calls are rate-limited and cached

## Registration & Deployment

### Widget Registration
- [ ] Widget exports metadata for registry
- [ ] Widget type is unique across platform
- [ ] Widget integrates with existing widget selector
- [ ] Widget appears correctly in marketplace

### Database Migration
- [ ] Database schema changes are documented
- [ ] Migration scripts are provided if needed
- [ ] Existing user data is preserved

### Edge Function Deployment (if applicable)
- [ ] Function deployed to Supabase
- [ ] Environment variables configured
- [ ] Function tested in production environment
- [ ] Rate limiting and security configured

## Final Review

### Code Review
- [ ] Code follows established patterns from other widgets
- [ ] No hardcoded values that should be configurable
- [ ] Error messages are user-friendly
- [ ] Loading states provide appropriate feedback
- [ ] Code is maintainable and well-structured

### User Experience
- [ ] Widget provides unique value that users can't get elsewhere
- [ ] Interface reduces friction to accomplish tasks
- [ ] Information is prioritized by function, not brand
- [ ] Widget integrates seamlessly with dashboard

### Platform Integration
- [ ] Widget follows platform design system
- [ ] Widget respects user's theme preferences (dark/light)
- [ ] Widget works within platform constraints
- [ ] Widget doesn't interfere with other widgets

## Post-Launch

### Monitoring
- [ ] Error logging is configured
- [ ] Performance metrics are tracked
- [ ] User feedback collection is enabled
- [ ] Analytics integration is working (if applicable)

### Maintenance
- [ ] Update strategy is planned
- [ ] Bug report process is established
- [ ] Feature request handling is documented
- [ ] Version control and release process is clear

---

## Common Pitfalls to Avoid

- **State Management**: Don't let component state get out of sync with persisted data
- **Memory Leaks**: Always clean up event listeners and timers in useEffect
- **Type Safety**: Don't bypass TypeScript with any or type assertions
- **Database Failures**: Always save to localStorage first, database sync is enhancement
- **Responsive Design**: Test all size combinations, don't assume desktop-only usage
- **Error Handling**: Provide meaningful error messages and recovery options
- **Performance**: Profile your widget under realistic data loads
- **Security**: Validate all inputs and never trust client-side data