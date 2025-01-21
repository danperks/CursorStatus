# CursorStatus

A tiny Cursor extension that monitors the status of Cursor, OpenAI, and Anthropic services in real-time. It provides a simple status indicator in your Cursor status bar, helping you stay informed about any service disruptions that might affect your development workflow.

Build with Cursor (in about 5 minutes)!

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