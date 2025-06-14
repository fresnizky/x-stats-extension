/**
 * Storage Manager Module
 * Handles Chrome extension storage operations for caching and user preferences
 */

class StorageManager {
  constructor() {
    this.storage = chrome?.storage?.local || null;
    this.prefix = "xstats_";
    this.defaultPreferences = {
      showExtendedMetrics: true,
      showHoverModal: true,
      darkMode: "auto",
      refreshInterval: 5000,
      cacheTimeout: 300000, // 5 minutes
    };
  }

  /**
   * Initialize storage with default preferences
   * @returns {Promise<void>}
   */
  async initialize() {
    if (!this.storage) {
      console.warn("Chrome storage not available, using localStorage fallback");
      return;
    }

    try {
      const existingPrefs = await this.getPreferences();
      if (!existingPrefs || Object.keys(existingPrefs).length === 0) {
        await this.setPreferences(this.defaultPreferences);
      }
    } catch (error) {
      console.error("Failed to initialize storage:", error);
    }
  }

  /**
   * Get user preferences
   * @returns {Promise<Object>} User preferences
   */
  async getPreferences() {
    const key = this.prefix + "preferences";

    if (this.storage) {
      try {
        const result = await this.storage.get(key);
        return result[key] || this.defaultPreferences;
      } catch (error) {
        console.error("Failed to get preferences:", error);
        return this.defaultPreferences;
      }
    } else {
      // Fallback to localStorage
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : this.defaultPreferences;
    }
  }

  /**
   * Set user preferences
   * @param {Object} preferences - Preferences to save
   * @returns {Promise<void>}
   */
  async setPreferences(preferences) {
    const key = this.prefix + "preferences";
    const merged = { ...this.defaultPreferences, ...preferences };

    if (this.storage) {
      try {
        await this.storage.set({ [key]: merged });
      } catch (error) {
        console.error("Failed to set preferences:", error);
      }
    } else {
      // Fallback to localStorage
      localStorage.setItem(key, JSON.stringify(merged));
    }
  }

  /**
   * Cache calculated metrics for a post
   * @param {string} postId - Unique post identifier
   * @param {Object} metrics - Calculated metrics
   * @returns {Promise<void>}
   */
  async cacheMetrics(postId, metrics) {
    if (!postId || !metrics) return;

    const key = this.prefix + "cache_" + postId;
    const cacheEntry = {
      metrics,
      timestamp: Date.now(),
      ttl: (await this.getPreferences()).cacheTimeout,
    };

    if (this.storage) {
      try {
        await this.storage.set({ [key]: cacheEntry });
      } catch (error) {
        console.error("Failed to cache metrics:", error);
      }
    } else {
      // Fallback to sessionStorage for temporary caching
      sessionStorage.setItem(key, JSON.stringify(cacheEntry));
    }
  }

  /**
   * Get cached metrics for a post
   * @param {string} postId - Unique post identifier
   * @returns {Promise<Object|null>} Cached metrics or null if expired/not found
   */
  async getCachedMetrics(postId) {
    if (!postId) return null;

    const key = this.prefix + "cache_" + postId;

    let cacheEntry;
    if (this.storage) {
      try {
        const result = await this.storage.get(key);
        cacheEntry = result[key];
      } catch (error) {
        console.error("Failed to get cached metrics:", error);
        return null;
      }
    } else {
      // Fallback to sessionStorage
      const stored = sessionStorage.getItem(key);
      cacheEntry = stored ? JSON.parse(stored) : null;
    }

    if (!cacheEntry) return null;

    // Check if cache is still valid
    const now = Date.now();
    const isExpired = now - cacheEntry.timestamp > cacheEntry.ttl;

    if (isExpired) {
      // Clean up expired cache
      await this.removeCachedMetrics(postId);
      return null;
    }

    return cacheEntry.metrics;
  }

  /**
   * Remove cached metrics for a post
   * @param {string} postId - Unique post identifier
   * @returns {Promise<void>}
   */
  async removeCachedMetrics(postId) {
    if (!postId) return;

    const key = this.prefix + "cache_" + postId;

    if (this.storage) {
      try {
        await this.storage.remove(key);
      } catch (error) {
        console.error("Failed to remove cached metrics:", error);
      }
    } else {
      sessionStorage.removeItem(key);
    }
  }

  /**
   * Clear all cached data
   * @returns {Promise<void>}
   */
  async clearCache() {
    if (this.storage) {
      try {
        const allItems = await this.storage.get(null);
        const cacheKeys = Object.keys(allItems).filter((key) =>
          key.startsWith(this.prefix + "cache_")
        );

        if (cacheKeys.length > 0) {
          await this.storage.remove(cacheKeys);
        }
      } catch (error) {
        console.error("Failed to clear cache:", error);
      }
    } else {
      // Clear sessionStorage cache
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(this.prefix + "cache_")) {
          sessionStorage.removeItem(key);
        }
      }
    }
  }

  /**
   * Get storage usage stats
   * @returns {Promise<Object>} Storage usage information
   */
  async getStorageStats() {
    if (!this.storage) return { used: 0, total: 0 };

    try {
      const bytesInUse = await this.storage.getBytesInUse();
      return {
        used: bytesInUse,
        total: chrome.storage.local.QUOTA_BYTES || 5242880, // 5MB default
        percentage: (
          (bytesInUse / (chrome.storage.local.QUOTA_BYTES || 5242880)) *
          100
        ).toFixed(2),
      };
    } catch (error) {
      console.error("Failed to get storage stats:", error);
      return { used: 0, total: 0 };
    }
  }
}

// Export for use in content script
window.StorageManager = StorageManager;
