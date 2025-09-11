// src/components/widgets/SampleWidget/types.ts

import { WidgetProps } from '../../../types';

// Basic item structure
export interface SampleItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Widget data structure
export interface SampleWidgetData {
  items: SampleItem[];
  title: string;
}

// Widget configuration
export interface SampleWidgetConfig {
  title?: string;
  maxItems?: number;
  onUpdate?: (config: SampleWidgetConfig) => void;
  onDelete?: () => void;
  widgetId?: string;
}

// Component props type
export type SampleWidgetProps = WidgetProps<SampleWidgetConfig & Record<string, unknown>>;

// Default configuration
export const DEFAULT_SAMPLE_CONFIG: Required<Omit<SampleWidgetConfig, 'onUpdate' | 'onDelete' | 'widgetId'>> = {
  title: 'Sample Widget',
  maxItems: 10,
};

// Widget metadata for registry
export const widgetMeta = {
  type: 'sample-widget',
  name: 'Sample Widget',
  icon: 'Layers',
  minWidth: 2,
  minHeight: 2,
  defaultWidth: 3,
  defaultHeight: 3,
  category: 'Productivity',
  description: 'A simple sample widget for developers to learn from',
};

// Validation helpers
export const validateSampleConfig = (input: unknown): SampleWidgetConfig => {
  if (!input || typeof input !== 'object') {
    return { ...DEFAULT_SAMPLE_CONFIG };
  }

  const candidate = input as Record<string, unknown>;

  return {
    title: typeof candidate.title === 'string' && candidate.title.trim()
      ? candidate.title.trim()
      : DEFAULT_SAMPLE_CONFIG.title,
    
    maxItems: typeof candidate.maxItems === 'number' && candidate.maxItems > 0
      ? Math.min(candidate.maxItems, 100)
      : DEFAULT_SAMPLE_CONFIG.maxItems,
    
    onUpdate: typeof candidate.onUpdate === 'function'
      ? candidate.onUpdate as (config: SampleWidgetConfig) => void
      : undefined,
    
    onDelete: typeof candidate.onDelete === 'function'
      ? candidate.onDelete as () => void
      : undefined,
    
    widgetId: typeof candidate.widgetId === 'string'
      ? candidate.widgetId
      : undefined,
  };
};

// Helper functions
export const createSampleItem = (title: string): SampleItem => ({
  id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  title: title.trim(),
  completed: false,
  createdAt: new Date(),
});

// Serialization for database storage
export interface SerializedSampleItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface SerializedSampleWidgetData {
  items: SerializedSampleItem[];
  title: string;
}

export const serializeSampleData = (data: SampleWidgetData): SerializedSampleWidgetData => ({
  items: data.items.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  })),
  title: data.title,
});

export const deserializeSampleData = (data: SerializedSampleWidgetData): SampleWidgetData => ({
  items: data.items.map(item => ({
    ...item,
    createdAt: new Date(item.createdAt),
  })),
  title: data.title,
});