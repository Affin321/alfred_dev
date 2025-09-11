import React, { ReactNode } from 'react';
import { Settings } from 'lucide-react';

interface WidgetHeaderProps {
  title?: ReactNode;
  icon?: ReactNode;
  onSettingsClick?: () => void;
  children?: ReactNode;
  settingsButtonClassName?: string;
}

/**
 * Shared widget header component
 * 
 * @param props Component props
 * @returns Widget header component
 */
const WidgetHeader = ({ 
  title, 
  icon, 
  onSettingsClick, 
  children, 
  settingsButtonClassName
}: WidgetHeaderProps): React.ReactElement => {
  return (
    <div className="flex justify-between items-center p-2 md:p-2 cursor-move widget-drag-handle">
      <div className="flex items-center space-x-1 md:space-x-2">
        {icon && <div className="text-gray-500 dark:text-slate-400 text-xs md:text-sm">{icon}</div>}
        {title && <h3 className="text-xs md:text-sm font-medium text-gray-800 dark:text-slate-100">{title}</h3>}
        {children}
      </div>
      {onSettingsClick && (
        <button 
          className={`settings-button p-0.5 md:p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full ${settingsButtonClassName || ''}`}
          aria-label='Settings'
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onSettingsClick();
          }}
        >
          <Settings size={14} className="text-gray-500 dark:text-slate-400" />
        </button>
      )}
    </div>
  );
};

export default WidgetHeader;