// src/components/widgets/index.ts

import React from "react";
import { WidgetConfig, WidgetProps } from "../../types";

// Widget Components
import SampleWidget from "./SampleWidget"
//import WordleWidget from "./WordleWidget";
// Import TemplateWidget (commented as it's not for production use)
// import TemplateWidget from './TemplateWidget/index';

// Export widget types
export * from "./SampleWidget/types";
//export * from "./WordleWidget/types";

// Export TemplateWidget types (commented as it's not for production use)
// export * from './TemplateWidget/types';

// Enhanced Widget Config
export interface EnhancedWidgetConfig extends WidgetConfig {
  category: string;
  description: string;
  supportsMultipleInstances?: boolean;
  [key: string]: unknown; // Add index signature to make it compatible with Record<string, unknown>
}

// Widget favicon mapping - maps widget type to favicon filename
const WIDGET_FAVICON_MAP: Record<string, string> = {
  'sample-widget': 'SampleWidgetFavicon.png',
};

// Function to get widget favicon
export const getWidgetFavicon = (widgetType: string): string => {
  const faviconFilename = WIDGET_FAVICON_MAP[widgetType];
  if (faviconFilename) {
    return `/widgetFavicons/${faviconFilename}`;
  }
  // Fallback to empty string if no favicon found
  return '';
};

// Widget registry with enhanced metadata - Keep icon property but use favicons in UI
export const WIDGET_REGISTRY: EnhancedWidgetConfig[] = [
  {
    type: "sample-widget",
    name: "Sample Widget",
    icon: "CheckSquare", // Keep for compatibility, but use favicon in UI
    minWidth: 2,
    minHeight: 2,
    defaultWidth: 2,
    defaultHeight: 2,
    category: "Productivity",
    supportsMultipleInstances: true,
    description:
      "This is a sample widget. Move it, drag it, expand it.",
  }
];

// Updated widget categories to match new structure
export const WIDGET_CATEGORIES = [
  { id: "news", name: "News" },
  { id: "productivity", name: "Productivity" },
  { id: "knowledge", name: "Knowledge" },
  { id: "curiosity", name: "Curiosity" },
  { id: "finance", name: "Finance" },
  { id: "entertainment", name: "Entertainment" },
  { id: "leisure", name: "Leisure" },
];

/**
 * Get widget component by type
 */
export const getWidgetComponent = (
  type: string
): React.ComponentType<WidgetProps<Record<string, unknown>>> | null => {
  switch (type) {
    case "sample-widget":
      return SampleWidget as unknown as React.ComponentType<
        WidgetProps<Record<string, unknown>>
      >;
    // case "wordle":
    //   return WordleWidget as unknown as React.ComponentType<
    //     WidgetProps<Record<string, unknown>>
    //   >;

    // Template widget registration (commented as it's not for production use)
    // case 'template':
    //   return TemplateWidget;
    default:
      return null;
      
  }
};

/**
 * Get widget configuration by type
 */
export const getWidgetConfigByType = (
  type: string
): EnhancedWidgetConfig | undefined => {
  return WIDGET_REGISTRY.find((widget) => widget.type === type);
};