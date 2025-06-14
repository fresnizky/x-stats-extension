/**
 * Metric Calculator Module
 * Calculates engagement ratios and derived metrics for X posts
 */

class MetricCalculator {
  constructor() {
    this.metrics = {
      engagementRate: "engagement_rate",
      likeToViewRatio: "like_to_view_ratio",
      retweetToLikeRatio: "retweet_to_like_ratio",
      replyToLikeRatio: "reply_to_like_ratio",
      totalEngagement: "total_engagement",
      engagementVelocity: "engagement_velocity",
    };
  }

  /**
   * Calculate all derived metrics for a post
   * @param {Object} baseMetrics - Base metrics from data extractor
   * @returns {Object} Calculated metrics
   */
  calculateMetrics(baseMetrics) {
    if (!baseMetrics) return null;

    const { likes, retweets, replies, views, bookmarks, timestamp } =
      baseMetrics;

    return {
      ...baseMetrics,
      // Engagement ratios
      engagementRate: this.calculateEngagementRate(
        likes,
        retweets,
        replies,
        views
      ),
      likeToViewRatio: this.calculateRatio(likes, views),
      retweetToLikeRatio: this.calculateRatio(retweets, likes),
      replyToLikeRatio: this.calculateRatio(replies, likes),

      // Composite metrics
      totalEngagement: this.calculateTotalEngagement(
        likes,
        retweets,
        replies,
        bookmarks
      ),
      engagementScore: this.calculateEngagementScore(
        likes,
        retweets,
        replies,
        views
      ),

      // Time-based metrics
      engagementVelocity: this.calculateVelocity(
        likes,
        retweets,
        replies,
        timestamp
      ),

      // Performance indicators
      performanceRating: this.calculatePerformanceRating(
        likes,
        retweets,
        replies,
        views
      ),
    };
  }

  /**
   * Calculate engagement rate as percentage
   * @param {number} likes - Like count
   * @param {number} retweets - Retweet count
   * @param {number} replies - Reply count
   * @param {number} views - View count
   * @returns {number} Engagement rate percentage
   */
  calculateEngagementRate(likes, retweets, replies, views) {
    if (!views || views === 0) return 0;

    const totalEngagement = (likes || 0) + (retweets || 0) + (replies || 0);
    return ((totalEngagement / views) * 100).toFixed(2);
  }

  /**
   * Calculate ratio between two metrics
   * @param {number} numerator - First metric
   * @param {number} denominator - Second metric
   * @returns {number} Ratio as percentage
   */
  calculateRatio(numerator, denominator) {
    if (!denominator || denominator === 0) return 0;
    return ((numerator / denominator) * 100).toFixed(2);
  }

  /**
   * Calculate total engagement count
   * @param {number} likes - Like count
   * @param {number} retweets - Retweet count
   * @param {number} replies - Reply count
   * @param {number} bookmarks - Bookmark count
   * @returns {number} Total engagement
   */
  calculateTotalEngagement(likes, retweets, replies, bookmarks) {
    return (likes || 0) + (retweets || 0) + (replies || 0) + (bookmarks || 0);
  }

  /**
   * Calculate weighted engagement score
   * @param {number} likes - Like count
   * @param {number} retweets - Retweet count
   * @param {number} replies - Reply count
   * @param {number} views - View count
   * @returns {number} Weighted engagement score
   */
  calculateEngagementScore(likes, retweets, replies, views) {
    // Weight different engagement types (retweets and replies are more valuable)
    const weightedScore =
      (likes || 0) * 1 + (retweets || 0) * 3 + (replies || 0) * 5;

    if (!views || views === 0) return weightedScore;

    return ((weightedScore / views) * 1000).toFixed(1); // Score per 1000 views
  }

  /**
   * Calculate engagement velocity (engagement per hour)
   * @param {number} likes - Like count
   * @param {number} retweets - Retweet count
   * @param {number} replies - Reply count
   * @param {Date} timestamp - Post timestamp
   * @returns {number} Engagement per hour
   */
  calculateVelocity(likes, retweets, replies, timestamp) {
    if (!timestamp) return 0;

    const now = new Date();
    const postTime = new Date(timestamp);
    const hoursElapsed = (now - postTime) / (1000 * 60 * 60);

    if (hoursElapsed <= 0) return 0;

    const totalEngagement = (likes || 0) + (retweets || 0) + (replies || 0);
    return (totalEngagement / hoursElapsed).toFixed(1);
  }

  /**
   * Calculate performance rating (A-F scale)
   * @param {number} likes - Like count
   * @param {number} retweets - Retweet count
   * @param {number} replies - Reply count
   * @param {number} views - View count
   * @returns {string} Performance grade
   */
  calculatePerformanceRating(likes, retweets, replies, views) {
    const engagementRate = this.calculateEngagementRate(
      likes,
      retweets,
      replies,
      views
    );

    if (engagementRate >= 10) return "A+";
    if (engagementRate >= 7) return "A";
    if (engagementRate >= 5) return "B+";
    if (engagementRate >= 3) return "B";
    if (engagementRate >= 2) return "C+";
    if (engagementRate >= 1) return "C";
    if (engagementRate >= 0.5) return "D";
    return "F";
  }

  /**
   * Format number for display (with K, M suffixes)
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  }
}

// Export for use in content script
window.MetricCalculator = MetricCalculator;
