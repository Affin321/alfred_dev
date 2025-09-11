// src/lib/services/widgetSync/sampleWidgetSync.ts

import { BaseWidgetSync } from '@/lib/services/widgetSync/baseWidgetSync';
import { WidgetSyncProvider } from '@/lib/types/syncTypes';
import { SyncResult } from '@/lib/types/syncResultTypes';
import { 
  SampleWidgetData, 
  createSampleItem,
  serializeSampleData,
  deserializeSampleData
} from '@/components/widgets/SampleWidget/types';
import { supabase } from '@/lib/supabase';
import { syncService } from '@/lib/syncService';

class SampleWidgetSync extends BaseWidgetSync<SampleWidgetData> implements WidgetSyncProvider<SampleWidgetData> {
  readonly widgetType = 'sample-widget';
  private readonly tableName = 'user_sample_widget_data';
  
  constructor() {
    super({
      tableName: 'user_sample_widget_data',
      localStoragePrefix: 'alfred-widget-sample', 
      widgetInstanceId: 'default'
    });
  }
  
  /**
   * Returns the default data structure for a new widget instance
   */
  getDefaultData(): SampleWidgetData {
    return {
      title: 'Sample Widget',
      items: [
        createSampleItem('Welcome to your sample widget!'),
        createSampleItem('Click the + button to add items'),
        createSampleItem('Use the settings icon to customize'),
      ]
    };
  }

  /**
   * Save data with localStorage fallback
   */
  async saveData(userId: string | null, data: SampleWidgetData): Promise<SyncResult<void>> {
    try {
      // Always save to localStorage first
      this.saveToLocalStorage('data', data);
      
      // If no authenticated user, we're done
      if (!userId) {
        return { success: true };
      }
      
      // Try to save to database
      try {
        const serializedData = serializeSampleData(data);
        
        const dbData = {
          user_id: userId,
          widget_instance_id: this.widgetInstanceId,
          widget_type: this.widgetType,
          data: serializedData,
          updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from(this.tableName)
          .upsert(dbData, {
            onConflict: 'user_id,widget_instance_id'
          });
        
        if (error) throw error;
        
        return { success: true };
      } catch (dbError) {
        console.warn(`${this.widgetType} database save failed:`, dbError);
        return { 
          success: true,
          error: dbError instanceof Error ? dbError.message : 'Database save failed'
        };
      }
      
    } catch (error) {
      console.warn(`${this.widgetType} save failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Save operation failed'
      };
    }
  }

  /**
   * Load data with localStorage fallback
   */
  async loadData(userId: string | null): Promise<SyncResult<SampleWidgetData>> {
    try {
      // Load from localStorage as baseline
      const localData = this.loadFromLocalStorage<SampleWidgetData>('data', this.getDefaultData());
      
      // If no authenticated user, return localStorage data
      if (!userId) {
        return { success: true, data: localData };
      }
      
      // Try to load from database
      try {
        const { data: dbData, error } = await supabase
          .from(this.tableName)
          .select('*')
          .eq('user_id', userId)
          .eq('widget_instance_id', this.widgetInstanceId)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        if (dbData?.data) {
          const deserializedData = deserializeSampleData(dbData.data);
          
          // Update localStorage with latest database data
          this.saveToLocalStorage('data', deserializedData);
          
          return { success: true, data: deserializedData };
        }
        
        // No database data found, return localStorage data
        return { success: true, data: localData };
        
      } catch (dbError) {
        console.warn(`${this.widgetType} database load failed:`, dbError);
        return {
          success: true,
          data: localData,
          error: dbError instanceof Error ? dbError.message : 'Database load failed, using cached data'
        };
      }
      
    } catch (error) {
      console.warn(`${this.widgetType} load failed:`, error);
      
      const defaultData = this.getDefaultData();
      return {
        success: true,
        data: defaultData,
        error: error instanceof Error ? error.message : 'Load failed, using defaults'
      };
    }
  }

  /**
   * Migrate localStorage data to database on first login
   */
  async migrateData(userId: string): Promise<SyncResult<void>> {
    try {
      // Check if user already has data in database
      const { data: existing, error: checkError } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('user_id', userId)
        .eq('widget_instance_id', this.widgetInstanceId)
        .limit(1);
      
      if (checkError) throw checkError;
      
      // Skip migration if data already exists
      if (existing && existing.length > 0) {
        return { success: true };
      }
      
      // Load localStorage data
      const localData = this.loadFromLocalStorage<SampleWidgetData>('data', this.getDefaultData());
      
      // Only migrate if there's meaningful data (more than just defaults)
      if (localData.items.length > 0) {
        const result = await this.saveData(userId, localData);
        return result;
      }
      
      return { success: true };
      
    } catch (error) {
      console.warn(`${this.widgetType} migration failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Migration failed'
      };
    }
  }
}

// Create singleton instance and register with sync service
const sampleWidgetSync = new SampleWidgetSync();
syncService.registerWidgetSync(sampleWidgetSync);

export default sampleWidgetSync;