// src/components/widgets/index.ts

import React from "react";
import { WidgetConfig, WidgetProps } from "../../types";

// Widget Components
import SampleWidget from "./SampleWidget"
import ProFlowWidget from "./ProFlow"  // Changed from QuickLinks

// Export widget types
export * from "./SampleWidget/types";
//export * from "./ProFlow/types";  // Changed from QuickLinks

// Enhanced Widget Config
export interface EnhancedWidgetConfig extends WidgetConfig {
  category: string;
  description: string;
  supportsMultipleInstances?: boolean;
  [key: string]: unknown;
}

// Widget favicon mapping
const WIDGET_FAVICON_MAP: Record<string, string> = {
  'sample-widget': 'SampleWidgetFavicon.png',
  'proflow': 'ProFlowFavicon.png',  // Changed from 'quicklinks'
};

// Function to get widget favicon
export const getWidgetFavicon = (widgetType: string): string => {
  const faviconFilename = WIDGET_FAVICON_MAP[widgetType];
  if (faviconFilename) {
    return `/widgetFavicons/${faviconFilename}`;
  }
  return '';
};

// Widget registry with enhanced metadata
export const WIDGET_REGISTRY: EnhancedWidgetConfig[] = [
  {
    type: "sample-widget",
    name: "Sample Widget",
    icon: "CheckSquare",
    minWidth: 2,
    minHeight: 2,
    defaultWidth: 2,
    defaultHeight: 2,
    category: "Productivity",
    supportsMultipleInstances: true,
    description: "This is a sample widget. Move it, drag it, expand it.",
  },
  {
  type: "proflow",  // Changed from "quicklinks"
  name: "ProFlow",  // Changed from "Quick Links"
  icon: "Link", // Better icon
  minWidth: 2,
  minHeight: 2,
  defaultWidth: 3,
  defaultHeight: 3,
  category: "Productivity",
  supportsMultipleInstances: true,
  description: "Smart session-based productivity flow management for students and professionals",
}
];

// Widget categories
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
    case "proflow":
      return ProFlowWidget as unknown as React.ComponentType<
        WidgetProps<Record<string, unknown>>
      >;
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