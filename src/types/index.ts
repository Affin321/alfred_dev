// src/types/index.ts

import { ReactNode } from 'react';
import { Layout } from 'react-grid-layout';

// Widget related types
export interface WidgetConfig {
  type: string;
  minWidth: number;
  minHeight: number;
  defaultWidth: number;
  defaultHeight: number;
  name: string;
  icon: string;
  category?: string;
  description?: string;
  defaultSize?: { w: number, h: number };
  minSize?: { w: number, h: number };
  maxSize?: { w: number, h: number };
}

export interface WidgetProps<T extends Record<string, unknown> = Record<string, unknown>> {
  width: number;
  height: number;
  config?: T & {
    onDelete?: () => void;
  };
  [key: string]: unknown;
}

// UI component types
export interface WidgetHeaderProps {
  title?: string;
  icon?: ReactNode;
  onSettingsClick?: () => void;
  children?: ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface WidgetSize {
  w: number;
  h: number;
}

export interface Widget {
  id: string;
  type: string;
  config: Record<string, unknown>;
  [key: string]: unknown;
}

export type LayoutItem = Layout;