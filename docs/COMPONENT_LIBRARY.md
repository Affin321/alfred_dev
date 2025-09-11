# Available UI Components for Widget Development

This guide covers the UI components and utilities available when developing widgets for the alfred_ platform.

## Core Philosophy

- **Use provided components when possible** for consistency and maintenance
- **Create custom components within your widget directory** when needed
- **Follow established patterns** rather than reinventing solutions
- **Maintain responsive design** across all widget sizes

## Essential Imports

```typescript
// Widget-specific components
import WidgetHeader from '../common/WidgetHeader';

// Core UI library (shadcn/ui based)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Notifications
import { toast } from 'sonner';

// Icons (Lucide React - extensive library)
import { Plus, Settings, Check, X, AlertCircle, RefreshCw, /* many more available */ } from 'lucide-react';

// Services
import { syncService } from '@/lib/syncService';
```

## Widget-Specific Components

### WidgetHeader

Standard header component used by all widgets:

```typescript
import WidgetHeader from '../common/WidgetHeader';

<WidgetHeader 
  title="Your Widget Title"
  onSettingsClick={() => setShowSettings(true)}
  actions={
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={handleAction}>
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  }
/>
```

**Props:**
- `title: string` - Widget title (adapts to size automatically)
- `onSettingsClick?: () => void` - Settings button handler
- `actions?: React.ReactNode` - Custom action buttons

## Core UI Components

### Buttons

```typescript
// Primary button
<Button onClick={handleClick}>Save</Button>

// Secondary button  
<Button variant="outline" onClick={handleClick}>Cancel</Button>

// Destructive button
<Button variant="destructive" onClick={handleDelete}>Delete</Button>

// Small icon button
<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
  <Settings className="h-3 w-3" />
</Button>
```

### Form Controls

```typescript
// Text input
<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text..."
/>

// Textarea
<Textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={3}
/>

// Select dropdown
<Select value={selected} onValueChange={setSelected}>
  <SelectTrigger>
    <SelectValue placeholder="Choose option..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>

// Switch toggle
<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
/>

// Checkbox
<Checkbox
  checked={completed}
  onCheckedChange={setCompleted}
/>
```

### Dialogs & Modals

```typescript
<Dialog open={showDialog} onOpenChange={setShowDialog}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    
    <div className="space-y-4 py-4">
      {/* Dialog content */}
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setShowDialog(false)}>
        Cancel
      </Button>
      <Button onClick={handleSave}>
        Save Changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Badges & Labels

```typescript
// Status badges
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Info</Badge>

// Form labels
<Label htmlFor="input-id">Field Label</Label>
```

### Tabs

```typescript
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList className="mb-4">
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  
  <TabsContent value="tab1">
    Content for tab 1
  </TabsContent>
  
  <TabsContent value="tab2">
    Content for tab 2
  </TabsContent>
</Tabs>
```

## Notifications

```typescript
// Success notification
toast.success('Operation completed successfully');

// Error notification  
toast.error('Something went wrong');

// Info notification
toast.info('Data updated');

// Loading notification
const toastId = toast.loading('Saving...');
// Later dismiss it
toast.dismiss(toastId);
```

## Standard Layout Patterns

### Widget Container

```typescript
<div className="widget-container h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
  <WidgetHeader title="Widget Title" />
  
  <div className="flex-1 overflow-auto p-3">
    {/* Main content */}
  </div>
</div>
```

### Loading State

```typescript
if (isLoading) {
  return (
    <div className="widget-container h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm p-4">
      <WidgetHeader title="Loading..." />
      <div className="flex items-center justify-center flex-1">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}
```

### Error State

```typescript
if (error) {
  return (
    <div className="widget-container h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm p-4">
      <WidgetHeader title="Error" />
      <div className="flex flex-col items-center justify-center flex-1 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm text-red-500 mb-3">{error}</p>
        <Button size="sm" onClick={handleRetry}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
```

### Empty State

```typescript
const renderEmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <YourIcon className="h-8 w-8 text-gray-400 mb-3" />
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
      No items yet
    </p>
    <Button size="sm" onClick={handleAdd}>
      Add First Item
    </Button>
  </div>
);
```

## Responsive Design Utilities

### Size Detection

```typescript
const displayMode = useMemo(() => {
  if (width <= 2 && height <= 2) return 'mini';      // 2x2 - Ultra compact
  if (width <= 2 || height <= 2) return 'compact';   // 2x3, 3x2 - Compact
  if (width <= 3 && height <= 3) return 'normal';    // 3x3 - Normal
  return 'expanded';                                  // 4x4+ - Full features
}, [width, height]);

const isCompact = displayMode === 'mini' || displayMode === 'compact';
```

### Adaptive Content

```typescript
// Conditional rendering based on size
{isCompact ? (
  <div className="text-xs space-y-1">
    {/* Compact view */}
  </div>
) : (
  <div className="space-y-3">
    {/* Full view */}
  </div>
)}

// Adaptive class names
<div className={`${isCompact ? 'p-2 text-sm' : 'p-4 text-base'}`}>
  Content
</div>
```

## Icon Library (Lucide React)

Extensive icon library available - commonly used icons:

```typescript
import { 
  // Actions
  Plus, Minus, Edit, Trash, Save, Cancel, Check, X,
  
  // Navigation
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowUp, ArrowDown,
  
  // UI Elements  
  Settings, Search, Filter, Menu, MoreHorizontal, MoreVertical,
  
  // Status
  AlertCircle, AlertTriangle, CheckCircle, Info, Warning,
  
  // Content
  File, Folder, Image, Link, Tag, Calendar, Clock, User,
  
  // Actions
  Copy, Share, Download, Upload, Refresh, Sync,
  
  // And hundreds more...
} from 'lucide-react';
```

## Data Service Integration

```typescript
// Save widget data
const success = await syncService.saveWidgetData('your-widget-type', data);

// Load widget data  
const data = await syncService.loadWidgetData<YourDataType>('your-widget-type');

// Get sync provider for advanced operations
const syncProvider = syncService.getWidgetSync('your-widget-type');
```

## Custom Component Guidelines

When creating custom components within your widget:

### File Organization
```
YourWidget/
├── components/           # Custom components directory
│   ├── YourCustomComponent.tsx
│   └── YourOtherComponent.tsx
├── hooks/               # Custom hooks  
│   └── useYourFeature.ts
├── utils/               # Utility functions
│   └── helpers.ts
├── types.ts
├── index.tsx
└── README.ts
```

### Component Structure
```typescript
// YourWidget/components/CustomComponent.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface CustomComponentProps {
  // Your props
}

export const CustomComponent: React.FC<CustomComponentProps> = ({ 
  // props 
}) => {
  return (
    <div className="custom-component">
      {/* Your implementation */}
    </div>
  );
};

export default CustomComponent;
```

### Custom Hooks
```typescript
// YourWidget/hooks/useYourFeature.ts
import { useState, useCallback } from 'react';

export const useYourFeature = () => {
  const [state, setState] = useState();
  
  const handler = useCallback(() => {
    // Implementation
  }, []);
  
  return { state, handler };
};
```

## Styling Guidelines

### Recommended Tailwind Classes

```typescript
// Colors (theme-aware)
'bg-white dark:bg-slate-900'
'text-gray-900 dark:text-white' 
'border-gray-200 dark:border-slate-700'

// Layout
'flex flex-col h-full'
'space-y-2 space-y-3 space-y-4'
'p-2 p-3 p-4' 
'rounded-lg'

// Interactive states
'hover:shadow-sm'
'transition-all duration-200'
'disabled:opacity-50'
```

### Avoid These Practices
- Don't hardcode colors (use theme variables)  
- Don't break responsive behavior
- Don't override core component styles globally

This component library provide consistency with platform widget development while maintaining flexibility for custom implementations. If we plan on updating UI Components in the future, you will received an email ahead of time.