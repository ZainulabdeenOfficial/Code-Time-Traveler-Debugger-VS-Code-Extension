# Screenshot Extension

This extension captures screenshots of your app’s UI at each execution point and integrates them into the timeline.

## How It Works
- Hooks into your app’s rendering pipeline (web/GUI)
- Captures screenshots at each timeline snapshot
- Stores images alongside execution data

## Usage
- Enable screenshot capture in your adapter configuration
- Screenshots will appear in the frontend timeline view

## Supported Platforms
- Web (HTML5 Canvas, Puppeteer, Selenium, etc.)
- Desktop GUI (platform-specific tools)

## Contributing
See [../docs/CONTRIBUTING.md](../docs/CONTRIBUTING.md) 