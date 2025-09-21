// existing types
export type LinkCategory = "class" | "study" | "library" | "tool" | "other";

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  category: LinkCategory;
  clicks: number;
  lastUsed?: string;
}

export interface WorkSession {
  id: string;
  name: string;
  links: QuickLink[];
}

export interface QuickLinksConfig {
  title?: string;
  links?: QuickLink[];
  sessions?: WorkSession[];
  activeSessionId?: string;
  maxLinks?: number;
  openInNewTab?: boolean;
  showCategories?: boolean;
  // make this Partial to match how the repo’s widgets update config incrementally
  onUpdate?: (next: Partial<QuickLinksConfig>) => void;
  onDelete?: () => void;
}

/** IMPORTANT: export widgetMeta (don’t remove it) and use a valid icon name. */
export const widgetMeta = {
  type: "proflow",           // must match your registry + getWidgetComponent
  name: "ProFlow",
  icon: "Link",              // use a known lucide icon name; "Workflow" isn't valid
  minWidth: 2,
  minHeight: 2,
  defaultWidth: 3,
  defaultHeight: 3,
  category: "Productivity",
  description: "Smart session-based productivity flow management",
} as const;

/** NEW: aliases so your component’s imports resolve */
export type ProFlowLink = QuickLink;
export type ProFlowConfig = QuickLinksConfig;
