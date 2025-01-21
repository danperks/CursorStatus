# CursorStatus

A VS Code extension that monitors the status of Cursor, OpenAI, and Anthropic services in real-time. It provides a simple status indicator in your VS Code status bar, helping you stay informed about any service disruptions that might affect your development workflow.

## Features

- Real-time status monitoring for:
  - Cursor
  - OpenAI
  - Anthropic

- Status bar indicator:
  - 🟢 Green dot: All services operational
  - 🟡 Orange warning: OpenAI or Anthropic services possibly degraded
  - 🔴 Red error: Cursor services degraded

- Automatic status updates every 5 minutes
- Detailed tooltip showing individual service statuses
- Manual refresh option
- Toggle between icon-only and text display

## Commands

The extension provides the following commands (accessible via command palette or by clicking the status bar icon):

- `CursorStatus: Show/Hide Text` - Toggle between icon-only and text display
- `CursorStatus: Refresh Status` - Manually refresh all service statuses

## Notifications

- Receive a notification when Cursor services become degraded (shown only once until service recovers)
- Status refresh confirmations only shown for manual refreshes

## Installation

1. Install the extension from the VS Code marketplace
2. The status indicator will appear in the bottom-right corner of your VS Code window
3. Click the indicator to access commands or hover to see detailed status

## Known Issues

- Status checks rely on the availability of each service's status API
- Some status pages might have rate limits or occasional downtime

## Release Notes

### 1.0.0

Initial release of CursorStatus:
- Real-time status monitoring
- Automatic 5-minute refresh
- Visual status indicators
- Service degradation notifications

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
