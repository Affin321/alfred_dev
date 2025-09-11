// src/components/WidgetErrorBoundary.tsx

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WidgetErrorBoundaryProps {
  children: React.ReactNode;
  widgetName?: string;
}

interface WidgetErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch errors in widget rendering for sandbox testing
 * 
 * Provides a fallback UI when a widget fails to render due to an error
 */
class WidgetErrorBoundary extends React.Component<WidgetErrorBoundaryProps, WidgetErrorBoundaryState> {
  constructor(props: WidgetErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): WidgetErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Widget rendering error:', error);
    console.error('Error info:', errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Card className="w-full h-full border-destructive/50">
          <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
            
            <h3 className="font-medium text-foreground mb-2">
              Widget Render Error
            </h3>
            
            <p className="text-sm text-muted-foreground mb-3">
              {this.props.widgetName || 'This widget'} failed to render
            </p>
            
            {this.state.error && (
              <details className="mb-4 text-left w-full">
                <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                  View Error Details
                </summary>
                <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto max-h-32 text-destructive">
                  {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      {'\n\nStack Trace:\n'}
                      {this.state.error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}
            
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Common fixes:</p>
              <ul className="text-left space-y-1">
                <li>• Check console for TypeScript errors</li>
                <li>• Ensure all imports are correct</li>
                <li>• Verify component props match interface</li>
                <li>• Check for missing dependencies</li>
              </ul>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={this.handleRetry}
              className="mt-4"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return this.props.children;
  }
}

export default WidgetErrorBoundary;