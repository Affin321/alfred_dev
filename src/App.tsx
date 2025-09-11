// src/App.tsx

// src/App.tsx

import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { getWidgetComponent, WIDGET_REGISTRY } from './components/widgets';
import { Button } from './components/ui/button';
import { Plus, RotateCcw, Moon, Sun } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// Grid configuration
const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

interface WidgetInstance {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

export default function WidgetSandbox() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Create a diverse set of sample widgets to showcase the ecosystem
  const [widgets, setWidgets] = useState<WidgetInstance[]>([
    {
      id: 'notes-demo',
      type: 'sample-widget',
      config: { 
        title: 'Notes Widget Demo',
        items: [
          { id: '1', title: 'Widget development best practices', completed: false },
          { id: '2', title: 'Test responsive layouts', completed: true },
          { id: '3', title: 'Implement drag & drop functionality', completed: true }
        ]
      }
    },
    {
      id: 'todo-demo',
      type: 'sample-widget',
      config: { 
        title: 'Todo List Demo',
        items: [
          { id: '1', title: 'Create widget template', completed: true },
          { id: '2', title: 'Add configuration options', completed: false },
          { id: '3', title: 'Test in different sizes', completed: false }
        ]
      }
    },
    {
      id: 'progress-demo',
      type: 'sample-widget',
      config: { 
        title: 'Progress Tracker',
        items: [
          { id: '1', title: 'Widget API documentation', completed: true },
          { id: '2', title: 'Responsive design guide', completed: true },
          { id: '3', title: 'Testing framework setup', completed: false }
        ]
      }
    },
    {
      id: 'settings-demo',
      type: 'sample-widget',
      config: { 
        title: 'Settings Demo',
        maxItems: 5,
        items: [
          { id: '1', title: 'Try clicking the settings icon', completed: false },
          { id: '2', title: 'Customize widget title', completed: false },
          { id: '3', title: 'Adjust maximum items', completed: false }
        ]
      }
    }
  ]);

  const [layouts, setLayouts] = useState<{ [key: string]: LayoutItem[] }>({
    lg: [
      { i: 'notes-demo', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
      { i: 'todo-demo', x: 3, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
      { i: 'progress-demo', x: 6, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
      { i: 'settings-demo', x: 9, y: 0, w: 3, h: 4, minW: 2, minH: 2 }
    ]
  });

  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Add widget
  const addWidget = () => {
    const newId = `sample-${Date.now()}`;
    const newWidget: WidgetInstance = {
      id: newId,
      type: 'sample-widget',
      config: { 
        title: `New Widget #${widgets.length + 1}`,
        items: [
          { id: '1', title: 'This is a new widget', completed: false },
          { id: '2', title: 'Try resizing it', completed: false }
        ]
      }
    };

    setWidgets(prev => [...prev, newWidget]);

    // Add to all layouts
    const newLayouts = { ...layouts };
    Object.keys(breakpoints).forEach(bp => {
      if (!newLayouts[bp]) newLayouts[bp] = [];
      
      const existingItems = newLayouts[bp];
      const maxY = existingItems.length > 0 ? Math.max(...existingItems.map(item => item.y + item.h)) : 0;
      
      newLayouts[bp].push({
        i: newId,
        x: 0,
        y: maxY,
        w: 3,
        h: 4,
        minW: 2,
        minH: 2
      });
    });

    setLayouts(newLayouts);
  };

  // Remove widget
  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    
    const newLayouts = { ...layouts };
    Object.keys(newLayouts).forEach(bp => {
      newLayouts[bp] = newLayouts[bp].filter(item => item.i !== widgetId);
    });
    setLayouts(newLayouts);
  };

  // Reset to demo layout
  const resetLayout = () => {
    setWidgets([
      {
        id: 'notes-demo',
        type: 'sample-widget',
        config: { 
          title: 'Notes Widget Demo',
          items: [
            { id: '1', title: 'Widget development best practices', completed: false },
            { id: '2', title: 'Test responsive layouts', completed: true },
            { id: '3', title: 'Implement drag & drop functionality', completed: true }
          ]
        }
      },
      {
        id: 'todo-demo',
        type: 'sample-widget',
        config: { 
          title: 'Todo List Demo',
          items: [
            { id: '1', title: 'Create widget template', completed: true },
            { id: '2', title: 'Add configuration options', completed: false },
            { id: '3', title: 'Test in different sizes', completed: false }
          ]
        }
      },
      {
        id: 'progress-demo',
        type: 'sample-widget',
        config: { 
          title: 'Progress Tracker',
          items: [
            { id: '1', title: 'Widget API documentation', completed: true },
            { id: '2', title: 'Responsive design guide', completed: true },
            { id: '3', title: 'Testing framework setup', completed: false }
          ]
        }
      },
      {
        id: 'settings-demo',
        type: 'sample-widget',
        config: { 
          title: 'Settings Demo',
          maxItems: 5,
          items: [
            { id: '1', title: 'Try clicking the settings icon', completed: false },
            { id: '2', title: 'Customize widget title', completed: false },
            { id: '3', title: 'Adjust maximum items', completed: false }
          ]
        }
      }
    ]);

    setLayouts({
      lg: [
        { i: 'notes-demo', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
        { i: 'todo-demo', x: 3, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
        { i: 'progress-demo', x: 6, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
        { i: 'settings-demo', x: 9, y: 0, w: 3, h: 4, minW: 2, minH: 2 }
      ]
    });
  };

  // Handle layout change
  const handleLayoutChange = (layout: LayoutItem[], allLayouts: { [key: string]: LayoutItem[] }) => {
    setLayouts(allLayouts);
  };

  // Render widget
  const renderWidget = (widget: WidgetInstance) => {
    const WidgetComponent = getWidgetComponent(widget.type);
    
    if (!WidgetComponent) {
      return (
        <div className="h-full bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-center justify-center">
          <p className="text-red-600 dark:text-red-400">Widget not found</p>
        </div>
      );
    }

    const mockConfig = {
      ...widget.config,
      onUpdate: (config: Record<string, unknown>) => {
        console.log(`[${widget.id}] Config updated:`, config);
        setWidgets(prev => prev.map(w => 
          w.id === widget.id ? { ...w, config: { ...w.config, ...config } } : w
        ));
      },
      onDelete: () => removeWidget(widget.id)
    };

    const layoutItem = layouts[currentBreakpoint]?.find(item => item.i === widget.id);
    const width = layoutItem?.w || 3;
    const height = layoutItem?.h || 4;

    return (
      <div className="h-full">
        <WidgetComponent
          config={mockConfig}
          width={width}
          height={height}
        />
      </div>
    );
  };

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
        {/* Header - styled like production */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-slate-950/80 border-b border-gray-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  alfred_ Widget Sandbox
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button onClick={addWidget} size="sm" className="rounded-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Widget
                </Button>
                <Button onClick={resetLayout} variant="outline" size="sm" className="rounded-full text-gray-900 dark:text-white">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={toggleTheme} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full w-9 h-9 p-0 text-gray-900 dark:text-white"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4">
            {/* Instructions - more like production onboarding */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Welcome to the Widget Development Environment
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-blue-800 dark:text-blue-200 text-sm">
                <div>
                  <p className="font-medium mb-2">Interaction:</p>
                  <ul className="space-y-1">
                    <li>• Drag widgets by their title bar</li>
                    <li>• Resize using the bottom-right corner</li>
                    <li>• Configure via settings icon</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Development:</p>
                  <ul className="space-y-1">
                    <li>• Test responsive behavior</li>
                    <li>• Validate different screen sizes</li>
                    <li>• Preview in light/dark themes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Dashboard Canvas */}
            <div className="relative">
              <ResponsiveReactGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={breakpoints}
                cols={cols}
                rowHeight={60}
                onLayoutChange={handleLayoutChange}
                onBreakpointChange={setCurrentBreakpoint}
                draggableHandle=".widget-drag-handle"
                draggableCancel=".settings-button"
                margin={[16, 16]}
                containerPadding={[20, 20]}
                useCSSTransforms={true}
                compactType="vertical"
                preventCollision={false}
              >
                {widgets.map(widget => (
                  <div 
                    key={widget.id}
                    className="app-widget"
                  >
                    {renderWidget(widget)}
                  </div>
                ))}
              </ResponsiveReactGridLayout>
            </div>

            {/* Developer Info Panel */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-4">
                <h3 className="font-semibold mb-2 dark:text-white">Current Breakpoint</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-mono bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                    {currentBreakpoint}
                  </span>
                  {' '}({Math.round(window.innerWidth)}px wide)
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-4">
                <h3 className="font-semibold mb-2 dark:text-white">Active Widgets</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {widgets.length} widget{widgets.length !== 1 ? 's' : ''} in grid
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-4">
                <h3 className="font-semibold mb-2 dark:text-white">Theme Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Currently: <span className="capitalize font-medium">{theme}</span>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}