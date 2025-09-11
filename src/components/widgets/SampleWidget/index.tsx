// src/components/widgets/SampleWidget/index.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import WidgetHeader from '../common/WidgetHeader';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Checkbox } from '../../ui/checkbox';
import { syncService } from '../../../lib/mockSyncService';
import {
  SampleWidgetProps,
  SampleWidgetConfig,
  SampleWidgetData,
  DEFAULT_SAMPLE_CONFIG,
  createSampleItem,
  validateSampleConfig,
  widgetMeta
} from './types';

// Export metadata for registry
export { widgetMeta };

export const SampleWidget: React.FC<SampleWidgetProps> = ({ 
  config, 
  width, 
  height 
}) => {
  // State management
  const [localConfig, setLocalConfig] = useState<SampleWidgetConfig>(() => 
    validateSampleConfig(config || {})
  );
  
  const [data, setData] = useState<SampleWidgetData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [newItemTitle, setNewItemTitle] = useState<string>('');

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const widgetData = await syncService.loadWidgetData<SampleWidgetData>('sample-widget');
        
        if (widgetData) {
          setData(widgetData);
        } else {
          // Initialize with default data
          const defaultData: SampleWidgetData = {
            title: localConfig.title || DEFAULT_SAMPLE_CONFIG.title,
            items: [
              createSampleItem('Welcome to your sample widget!'),
              createSampleItem('Click + to add new items'),
              createSampleItem('Click settings to customize'),
            ]
          };
          setData(defaultData);
          await syncService.saveWidgetData('sample-widget', defaultData);
        }
      } catch {
        const errorMessage = 'Failed to load widget data';
        setError(errorMessage);        
        // Set fallback data
        setData({
          title: localConfig.title || DEFAULT_SAMPLE_CONFIG.title,
          items: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [localConfig.title]);

  // Save data helper
  const saveData = useCallback(async (updatedData: SampleWidgetData) => {
    try {
      const success = await syncService.saveWidgetData('sample-widget', updatedData);
      
      if (success) {
        setData(updatedData);
        if (config?.onUpdate) {
          config.onUpdate(localConfig);
        }
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }, [config, localConfig]);

  // Add new item
  const handleItemAdd = useCallback(async () => {
    if (!data || !newItemTitle.trim()) {
      return;
    }
    
    const newItem = createSampleItem(newItemTitle.trim());
    const updatedData: SampleWidgetData = {
      ...data,
      items: [newItem, ...data.items].slice(0, localConfig.maxItems || DEFAULT_SAMPLE_CONFIG.maxItems)
    };
    
    const success = await saveData(updatedData);
    if (success) {
      setNewItemTitle('');
      setShowAddDialog(false);
    }
  }, [data, newItemTitle, localConfig.maxItems, saveData]);

  // Toggle item completion
  const handleItemToggle = useCallback(async (itemId: string) => {
    if (!data) return;
    
    const updatedItems = data.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    
    const updatedData: SampleWidgetData = {
      ...data,
      items: updatedItems
    };
    
    await saveData(updatedData);
  }, [data, saveData]);

  // Delete item
  const handleItemDelete = useCallback(async (itemId: string) => {
    if (!data) return;
    
    const item = data.items.find(i => i.id === itemId);
    if (!item) return;
    
    const confirmed = window.confirm(`Delete "${item.title}"?`);
    if (!confirmed) return;
    
    const updatedItems = data.items.filter(i => i.id !== itemId);
    const updatedData: SampleWidgetData = {
      ...data,
      items: updatedItems
    };
    
    const success = await saveData(updatedData);
    if (success) {
    }
  }, [data, saveData]);

  // Save settings
  const handleSaveSettings = useCallback(async () => {
    if (!data) return;
    
    const updatedData: SampleWidgetData = {
      ...data,
      title: localConfig.title || DEFAULT_SAMPLE_CONFIG.title
    };
    
    const success = await saveData(updatedData);
    if (success) {
      setShowSettings(false);
    }
  }, [data, localConfig, saveData]);

  // Responsive design
  const isCompact = width <= 2 || height <= 2;
  const displayTitle = isCompact ? "Sample" : data?.title || "Sample";

  // Loading state
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

  // Error state
  if (error && !data) {
    return (
      <div className="widget-container h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm p-4">
        <WidgetHeader title="Error" />
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <Button size="sm" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="widget-container h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
      <WidgetHeader 
        title={displayTitle}
        onSettingsClick={() => setShowSettings(true)}
      />

      {/* Add Item Button */}
      <div className="px-3 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAddDialog(true)}
          className="h-8 w-full flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto px-3 pb-3">
        {data.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Plus className="h-8 w-8 text-gray-400 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              No items yet
            </p>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {data.items.map(item => (
              <div
                key={item.id}
                className={`
                  flex items-center gap-2 p-2 rounded-lg border hover:shadow-sm transition-all
                  ${item.completed ? 'bg-gray-50 dark:bg-slate-800 opacity-75' : 'bg-white dark:bg-slate-900'}
                `}
              >
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleItemToggle(item.id)}
                  className="flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className={`truncate ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {item.title}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleItemDelete(item.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-600 dark:text-white"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md dark:bg-slate-900 dark:text-white dark:border-slate-700">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title-input" className="dark:text-white">Title</Label>
              <Input
                id="title-input"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Enter item title..."
                className="dark:bg-slate-800 dark:text-white dark:border-slate-600"
                onKeyPress={(e) => e.key === 'Enter' && handleItemAdd()}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline"
              className="dark:bg-slate-800 dark:text-white dark:border-slate-600"
              onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleItemAdd}
              className="dark:bg-slate-800 dark:text-white dark:border-slate-600"
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md dark:bg-slate-900 dark:text-white dark:border-slate-700">
          <DialogHeader>
            <DialogTitle>Widget Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="widget-title" className="dark:text-white">Widget Title</Label>
              <Input
                id="widget-title"
                value={localConfig.title || ""}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Sample Widget"
                className="dark:bg-slate-800 dark:text-white dark:border-slate-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-items" className="dark:text-white">Maximum Items</Label>
              <Input
                id="max-items"
                type="number"
                min="1"
                max="100"
                value={localConfig.maxItems || DEFAULT_SAMPLE_CONFIG.maxItems}
                className="dark:bg-slate-800 dark:text-white dark:border-slate-600"
                onChange={(e) => setLocalConfig(prev => ({ 
                  ...prev, 
                  maxItems: parseInt(e.target.value) || DEFAULT_SAMPLE_CONFIG.maxItems 
                }))}
              />
            </div>
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full">
              {config?.onDelete && (
                <Button variant="destructive" onClick={config.onDelete}>
                  Delete Widget
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSettings}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SampleWidget;