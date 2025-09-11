// src/WidgetPreview.tsx

import React, { Suspense } from 'react';
import { Card, CardContent } from './ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import WidgetErrorBoundary from './WidgetErrorBoundary';

interface WidgetPreviewProps {
  widgetType: string;
  width: number;
  height: number;
  availableWidgets: Array<{
    type: string;
    name: string;
    component: React.LazyExoticComponent<React.ComponentType<any>>;
  }>;
}

// Loading fallback
function WidgetLoadingSkeleton(): JSX.Element {
  return (
    <Card className="w-full h-full flex items-center justify-center">
      <div className="flex items-center gap-2 text-muted-foreground">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span>Loading widget...</span>
      </div>
    </Card>
  );
}

export function WidgetPreview({
  widgetType,
  width,
  height,
  availableWidgets
}: WidgetPreviewProps): JSX.Element {
  const widget = availableWidgets.find(w => w.type === widgetType);

  if (!widget) {
    return (
      <Card className="w-full h-full border-destructive/50">
        <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mb-4" />
          <h3 className="font-medium text-foreground mb-2">
            Widget Not Found
          </h3>
          <p className="text-sm text-muted-foreground">
            Widget type "{widgetType}" is not available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Mock config for the widget
  const mockConfig = {
    title: 'Sandbox Test Widget',
    onUpdate: (config: any) => {
      console.log('[Sandbox] Widget config updated:', config);
    },
    onDelete: () => {
      console.log('[Sandbox] Widget delete requested');
    },
    widgetId: `sandbox-${widgetType}-${Date.now()}`
  };

  const WidgetComponent = widget.component;

  return (
    <div className="w-full h-full">
      <WidgetErrorBoundary widgetName={widget.name}>
        <Suspense fallback={<WidgetLoadingSkeleton />}>
          <WidgetComponent
            config={mockConfig}
            width={width}
            height={height}
          />
        </Suspense>
      </WidgetErrorBoundary>
    </div>
  );
}