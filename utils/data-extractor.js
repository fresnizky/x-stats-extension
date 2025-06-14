/**
 * Data Extractor Module
 * Handles extraction of metrics from X (Twitter) posts
 */

class DataExtractor {
  constructor() {
    this.selectors = {
      post: '[data-testid="tweet"]',
      likes: '[data-testid="like"]',
      retweets: '[data-testid="retweet"]',
      replies: '[data-testid="reply"]',
      views: '[role="group"] span:contains("views")',
      bookmarks: '[data-testid="bookmark"]',
      engagement: '[role="group"]',
    };
  }

  /**
   * Extract metrics from a post element
   * @param {Element} postElement - The post DOM element
   * @returns {Object} Extracted metrics
   */
  extractMetrics(postElement) {
    if (!postElement) return null;

    try {
      const metrics = {
        likes: this.extractCount(postElement, this.selectors.likes),
        retweets: this.extractCount(postElement, this.selectors.retweets),
        replies: this.extractCount(postElement, this.selectors.replies),
        views: this.extractViews(postElement),
        bookmarks: this.extractCount(postElement, this.selectors.bookmarks),
        timestamp: this.extractTimestamp(postElement),
      };

      return metrics;
    } catch (error) {
      console.error("Error extracting metrics:", error);
      return null;
    }
  }

  /**
   * Extract numerical count from engagement button
   * @param {Element} container - Container element
   * @param {string} selector - CSS selector for the button
   * @returns {number} Extracted count
   */
  extractCount(container, selector) {
    const element = container.querySelector(selector);
    if (!element) return 0;

    const text = element.textContent.trim();
    return this.parseCount(text);
  }

  /**
   * Extract view count (may have different selector pattern)
   * @param {Element} container - Container element
   * @returns {number} View count
   */
  extractViews(container) {
    // Views might be in different locations, implement specific logic
    const viewElements = container.querySelectorAll('[role="group"] span');
    for (const element of viewElements) {
      const text = element.textContent.toLowerCase();
      if (text.includes("view")) {
        return this.parseCount(text);
      }
    }
    return 0;
  }

  /**
   * Extract post timestamp
   * @param {Element} container - Container element
   * @returns {Date|null} Post timestamp
   */
  extractTimestamp(container) {
    const timeElement = container.querySelector("time");
    if (timeElement && timeElement.dateTime) {
      return new Date(timeElement.dateTime);
    }
    return null;
  }

  /**
   * Parse count text to number (handles K, M, etc.)
   * @param {string} text - Text containing count
   * @returns {number} Parsed number
   */
  parseCount(text) {
    if (!text || typeof text !== "string") return 0;

    const cleanText = text.replace(/[^\d.KMB]/gi, "");
    const number = parseFloat(cleanText);

    if (isNaN(number)) return 0;

    if (text.toLowerCase().includes("k")) return Math.floor(number * 1000);
    if (text.toLowerCase().includes("m")) return Math.floor(number * 1000000);
    if (text.toLowerCase().includes("b"))
      return Math.floor(number * 1000000000);

    return Math.floor(number);
  }
}

// Export for use in content script
window.DataExtractor = DataExtractor;
