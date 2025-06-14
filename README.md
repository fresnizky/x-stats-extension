# X-Stats Extension

A Chrome browser extension that enhances X (formerly Twitter) post statistics with advanced engagement metrics and ratios.

## Overview

The X-Stats Extension provides additional insights into post performance by calculating and displaying engagement ratios, view velocity, and other derived metrics that aren't natively shown by X. The extension seamlessly integrates with X's existing UI to provide meaningful analytics without disrupting the user experience.

## Features

### Core Statistics

- **Engagement Ratios**: likes/views, reposts/views, comments/views
- **View Velocity**: views per hour, views per minute since posting
- **Engagement Rate**: overall engagement percentage
- **Reach Efficiency**: comprehensive performance metrics

### UI Options

- **Expanded Bottom Row**: Additional metrics displayed inline with existing engagement buttons
- **Hover Modal**: Detailed statistics popup with charts and comprehensive analysis
- **User Preferences**: Toggle between display modes and customize appearance

### Design Principles

- **Non-intrusive**: Enhances rather than replaces existing functionality
- **Native Feel**: Matches X's visual design language and themes
- **Performance-first**: Lightweight implementation with minimal impact
- **Privacy-focused**: No external data transmission or collection

## Technical Stack

- **Vanilla JavaScript** (ES6+)
- **CSS3** with theme support
- **Chrome Manifest V3**
- **Jest** for testing
- **No heavy frameworks** (React, Tailwind, etc.)

## Project Structure

```
x-stats-extension/
├── manifest.json          # Chrome extension manifest
├── content.js            # Main content script
├── background.js         # Background service worker
├── popup/               # Extension popup UI
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── styles/              # CSS stylesheets
│   ├── main.css         # Main styles
│   └── themes.css       # Theme support
├── utils/               # Utility modules
│   ├── calculator.js    # Metric calculations
│   ├── dom-helper.js    # DOM manipulation
│   └── storage.js       # Data storage
└── icons/               # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Development

### Prerequisites

- Node.js 16+ and npm
- Chrome browser for testing
- Git for version control

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/x-stats-extension.git
cd x-stats-extension

# Install dependencies
npm install

# Run tests
npm test

# Lint code
npm run lint
```

### Development Workflow

This project uses TaskMaster for project management with a Git workflow based on task branches:

1. **Task Branches**: Each task gets its own branch (`task-{id}-{description}`)
2. **Subtask Commits**: Commit after completing each subtask
3. **Pull Requests**: Create PR when task is complete

See [Git Workflow Rules](.cursor/rules/git_workflow.mdc) for detailed workflow documentation.

### Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the project directory
4. The extension should now be loaded and active on X.com

## Testing

### Unit Tests

```bash
npm test                 # Run all tests
npm test -- --watch     # Run tests in watch mode
npm test -- --coverage  # Run with coverage report
```

### Manual Testing

1. Load extension in Chrome
2. Navigate to X.com
3. Verify metrics appear on posts
4. Test both UI modes (expanded row and hover modal)
5. Verify dark/light theme compatibility

## Performance Requirements

- **Extension load time**: < 100ms
- **Metric calculation**: < 50ms per post
- **Memory usage**: < 10MB
- **Page load impact**: < 5% increase

## Browser Compatibility

- **Primary**: Chrome (latest versions)
- **Secondary**: Chromium-based browsers (Edge, Brave, etc.)

## Privacy & Security

- **No external API calls**: All processing happens locally
- **No data collection**: Extension doesn't transmit user data
- **Minimal permissions**: Only requires access to X.com
- **Content Security Policy**: Strict CSP implementation

## Contributing

1. Check the [TaskMaster tasks](.taskmaster/tasks/) for current development priorities
2. Follow the [Git workflow](.cursor/rules/git_workflow.mdc) for branch management
3. Ensure tests pass and coverage remains high
4. Update documentation for any new features

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Chrome Web Store

_Extension pending submission to Chrome Web Store_

## Support

For issues, feature requests, or questions:

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/x-stats-extension/issues)
- **Documentation**: Check the `.taskmaster/docs/` directory
- **Development**: See TaskMaster tasks for current development status

---

**Built with TaskMaster AI** - Structured development through intelligent task management.
