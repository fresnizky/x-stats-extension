/**
 * DOM Helpers Module
 * Utilities for DOM manipulation and integration with X's UI
 */

class DOMHelpers {
  constructor() {
    this.selectors = {
      post: '[data-testid="tweet"]',
      postActions: '[role="group"]',
      timeline: '[data-testid="primaryColumn"]',
      userProfileName: '[data-testid="UserName"]',
      tweetText: '[data-testid="tweetText"]',
    };

    this.cssClasses = {
      extension: "x-stats-extension",
      metrics: "x-stats-metrics",
      metric: "x-stats-metric",
      modal: "x-stats-modal",
      tooltip: "x-stats-tooltip",
      loading: "x-stats-loading",
    };
  }

  /**
   * Create a DOM element with specified attributes and classes
   * @param {string} tag - HTML tag name
   * @param {Object} options - Element options
   * @returns {Element} Created element
   */
  createElement(tag, options = {}) {
    const element = document.createElement(tag);

    if (options.className) {
      element.className = options.className;
    }

    if (options.id) {
      element.id = options.id;
    }

    if (options.textContent) {
      element.textContent = options.textContent;
    }

    if (options.innerHTML) {
      element.innerHTML = options.innerHTML;
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    if (options.styles) {
      Object.assign(element.style, options.styles);
    }

    return element;
  }

  /**
   * Find the post container element for a given element
   * @param {Element} element - Element within a post
   * @returns {Element|null} Post container element
   */
  findPostContainer(element) {
    return element.closest(this.selectors.post);
  }

  /**
   * Get a unique identifier for a post
   * @param {Element} postElement - Post container element
   * @returns {string|null} Unique post identifier
   */
  getPostId(postElement) {
    if (!postElement) return null;

    // Try to find a unique identifier
    const timeElement = postElement.querySelector("time");
    if (timeElement && timeElement.dateTime) {
      return btoa(timeElement.dateTime).replace(/[^a-zA-Z0-9]/g, "");
    }

    // Fallback to generating an ID based on content
    const textElement = postElement.querySelector(this.selectors.tweetText);
    if (textElement) {
      const text = textElement.textContent.trim();
      if (text.length > 0) {
        return btoa(text.substring(0, 50)).replace(/[^a-zA-Z0-9]/g, "");
      }
    }

    return "post_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Create metrics display element
   * @param {Object} metrics - Calculated metrics
   * @returns {Element} Metrics display element
   */
  createMetricsDisplay(metrics) {
    const container = this.createElement("div", {
      className: `${this.cssClasses.extension} ${this.cssClasses.metrics}`,
    });

    // Add engagement rate
    if (metrics.engagementRate > 0) {
      const engagementElement = this.createElement("span", {
        className: this.cssClasses.metric,
        textContent: `${metrics.engagementRate}% engagement`,
        attributes: {
          "data-tooltip":
            "Engagement rate: (likes + retweets + replies) / views",
        },
      });
      container.appendChild(engagementElement);
    }

    // Add performance rating
    if (metrics.performanceRating) {
      const ratingElement = this.createElement("span", {
        className: this.cssClasses.metric,
        textContent: `Grade: ${metrics.performanceRating}`,
        attributes: {
          "data-tooltip": "Performance rating based on engagement metrics",
        },
      });
      container.appendChild(ratingElement);
    }

    // Add engagement velocity
    if (metrics.engagementVelocity > 0) {
      const velocityElement = this.createElement("span", {
        className: this.cssClasses.metric,
        textContent: `${metrics.engagementVelocity}/hr`,
        attributes: {
          "data-tooltip": "Engagement velocity: interactions per hour",
        },
      });
      container.appendChild(velocityElement);
    }

    return container;
  }

  /**
   * Create hover modal for detailed statistics
   * @param {Object} metrics - Calculated metrics
   * @returns {Element} Modal element
   */
  createHoverModal(metrics) {
    const modal = this.createElement("div", {
      className: `${this.cssClasses.extension} ${this.cssClasses.modal}`,
      styles: {
        display: "none",
        position: "fixed",
        zIndex: "9999",
      },
    });

    const content = `
      <div class="modal-header">
        <h3>Detailed Statistics</h3>
      </div>
      <div class="modal-body">
        <div class="metric-row">
          <span class="label">Engagement Rate:</span>
          <span class="value">${metrics.engagementRate || 0}%</span>
        </div>
        <div class="metric-row">
          <span class="label">Performance Grade:</span>
          <span class="value">${metrics.performanceRating || "N/A"}</span>
        </div>
        <div class="metric-row">
          <span class="label">Total Engagement:</span>
          <span class="value">${this.formatNumber(
            metrics.totalEngagement || 0
          )}</span>
        </div>
        <div class="metric-row">
          <span class="label">Engagement Score:</span>
          <span class="value">${metrics.engagementScore || 0}</span>
        </div>
        <div class="metric-row">
          <span class="label">Velocity:</span>
          <span class="value">${metrics.engagementVelocity || 0}/hr</span>
        </div>
        <div class="metric-row">
          <span class="label">Like/View Ratio:</span>
          <span class="value">${metrics.likeToViewRatio || 0}%</span>
        </div>
        <div class="metric-row">
          <span class="label">RT/Like Ratio:</span>
          <span class="value">${metrics.retweetToLikeRatio || 0}%</span>
        </div>
      </div>
    `;

    modal.innerHTML = content;
    return modal;
  }

  /**
   * Insert metrics display into post
   * @param {Element} postElement - Post container element
   * @param {Element} metricsElement - Metrics display element
   * @returns {boolean} Success status
   */
  insertMetricsIntoPost(postElement, metricsElement) {
    if (!postElement || !metricsElement) return false;

    // Find the actions row (likes, retweets, etc.)
    const actionsRow = postElement.querySelector(this.selectors.postActions);
    if (!actionsRow) return false;

    // Check if metrics already exist
    const existing = postElement.querySelector(`.${this.cssClasses.metrics}`);
    if (existing) {
      existing.replaceWith(metricsElement);
    } else {
      // Insert after the actions row
      actionsRow.parentNode.insertBefore(
        metricsElement,
        actionsRow.nextSibling
      );
    }

    return true;
  }

  /**
   * Show modal at specified position
   * @param {Element} modal - Modal element
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  showModalAt(modal, x, y) {
    if (!modal) return;

    // Add to document if not already there
    if (!modal.parentNode) {
      document.body.appendChild(modal);
    }

    // Position the modal
    modal.style.left = x + "px";
    modal.style.top = y + "px";
    modal.style.display = "block";

    // Adjust position if modal goes off-screen
    const rect = modal.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.right > viewportWidth) {
      modal.style.left = x - rect.width + "px";
    }

    if (rect.bottom > viewportHeight) {
      modal.style.top = y - rect.height + "px";
    }
  }

  /**
   * Hide modal
   * @param {Element} modal - Modal element
   */
  hideModal(modal) {
    if (modal) {
      modal.style.display = "none";
    }
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

  /**
   * Detect if user prefers dark mode
   * @returns {boolean} True if dark mode is preferred
   */
  isDarkMode() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  /**
   * Add tooltip functionality to elements with data-tooltip attribute
   * @param {Element} container - Container to search for tooltip elements
   */
  addTooltips(container) {
    const elementsWithTooltips = container.querySelectorAll("[data-tooltip]");

    elementsWithTooltips.forEach((element) => {
      element.addEventListener("mouseenter", (e) => {
        this.showTooltip(e.target, e.target.getAttribute("data-tooltip"));
      });

      element.addEventListener("mouseleave", () => {
        this.hideTooltip();
      });
    });
  }

  /**
   * Show tooltip
   * @param {Element} target - Target element
   * @param {string} text - Tooltip text
   */
  showTooltip(target, text) {
    const tooltip = this.createElement("div", {
      className: this.cssClasses.tooltip,
      textContent: text,
      id: "x-stats-tooltip",
    });

    document.body.appendChild(tooltip);

    const rect = target.getBoundingClientRect();
    tooltip.style.left =
      rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + "px";
  }

  /**
   * Hide tooltip
   */
  hideTooltip() {
    const tooltip = document.getElementById("x-stats-tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  }
}

// Export for use in content script
window.DOMHelpers = DOMHelpers;
