// src/lib/mockSyncService.ts

/**
 * Mock sync service for development/testing
 * Uses localStorage instead of external services
 */
class MockSyncService {
    private getStorageKey(widgetType: string): string {
      return `mock-widget-data-${widgetType}`;
    }
  
    async loadWidgetData<T>(widgetType: string): Promise<T | null> {
      try {
        const stored = localStorage.getItem(this.getStorageKey(widgetType));
        if (!stored) return null;
        
        const data = JSON.parse(stored);
        console.log(`[MockSync] Loaded data for ${widgetType}:`, data);
        return data;
      } catch (error) {
        console.warn(`[MockSync] Failed to load data for ${widgetType}:`, error);
        return null;
      }
    }
  
    async saveWidgetData<T>(widgetType: string, data: T): Promise<boolean> {
      try {
        localStorage.setItem(this.getStorageKey(widgetType), JSON.stringify(data));
        console.log(`[MockSync] Saved data for ${widgetType}:`, data);
        return true;
      } catch (error) {
        console.warn(`[MockSync] Failed to save data for ${widgetType}:`, error);
        return false;
      }
    }
  
    async clearWidgetData(widgetType: string): Promise<boolean> {
      try {
        localStorage.removeItem(this.getStorageKey(widgetType));
        console.log(`[MockSync] Cleared data for ${widgetType}`);
        return true;
      } catch (error) {
        console.warn(`[MockSync] Failed to clear data for ${widgetType}:`, error);
        return false;
      }
    }
  
    // Additional methods your widgets might use
    async loadUserProfile(): Promise<Record<string, unknown>> {
      const stored = localStorage.getItem('mock-user-profile');
      return stored ? JSON.parse(stored) : {};
    }
  
    async saveUserProfile(profile: Record<string, unknown>): Promise<boolean> {
      try {
        localStorage.setItem('mock-user-profile', JSON.stringify(profile));
        return true;
      } catch {
        return false;
      }
    }
  }
  
  export const syncService = new MockSyncService();