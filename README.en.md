<div align="center">

# Global Readonly

**One-click read-only toggle for your entire VS Code workspace**

[English](./README.en.md) · [中文](./README.md)

[![License](https://img.shields.io/github/license/kain-jiang/global-readonly)](https://github.com/kain-jiang/global-readonly/blob/main/LICENSE)
[![CI](https://github.com/kain-jiang/global-readonly/actions/workflows/ci.yml/badge.svg)](https://github.com/kain-jiang/global-readonly/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/VS%20Code-%5E1.77.0-blue)](https://code.visualstudio.com/updates/v1_77)
[![Stars](https://img.shields.io/github/stars/kain-jiang/global-readonly?style=social)](https://github.com/kain-jiang/global-readonly)

</div>

---

Toggle **read-only mode for the entire workspace** with one click, powered by VS Code's built-in [`files.readonlyInclude`](https://code.visualstudio.com/docs/getstarted/settings) feature — no file watchers, no monkey patching, no lockouts.

## Features

- **One-click toggle** — click the status bar item (or run a command) to make the whole workspace read-only / writable.
- **Native VS Code enforcement** — sets `files.readonlyInclude: { "**": true }`, so read-only state is enforced by VS Code itself, persists across restarts, and keeps the standard read-only UX (no accidental edits).
- **Only the settings file stays writable** — excludes only `.vscode/settings.json` via `files.readonlyExclude`, so the toggle keeps working while other `.vscode/` files remain read-only.
- **Preserves your rules** — only the `**` entry is removed on disable; any other `readonlyInclude` / `readonlyExclude` patterns you defined are kept.
- **Workspace-only** — commands and the status bar are hidden or disabled when no workspace is open, and global settings are never modified.
- **Status bar indicator** — shows `$(lock) Readonly` / `$(unlock) Readonly` and stays in sync even if you change the setting manually.

## Commands

| Command | Description |
| --- | --- |
| `Global Readonly: Enable` | Make the entire workspace read-only |
| `Global Readonly: Disable` | Make the entire workspace writable |
| `Global Readonly: Toggle` | Switch between read-only and writable |

## Usage

1. Install the extension (from VSIX or the Marketplace).
2. Click the **Readonly** item in the status bar (right side) to toggle, or run any of the commands above from the Command Palette (`Ctrl+Shift+P`).

When enabled, every file in the workspace becomes read-only in the editor.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `globalReadonly.showStatusBar` | `true` | Show the status bar item that displays state and toggles on click. |

## How it works

The extension reads and writes the built-in `files.readonlyInclude` configuration:

```jsonc
{
  // written on enable (readonlyExclude keeps the settings file writable)
  "files.readonlyInclude": { "**": true },
  "files.readonlyExclude": { "**/.vscode/settings.json": true }
}
```

The `**` glob matches every file in the workspace, marking them read-only. Disabling simply removes those entries, leaving any user-defined patterns untouched.

> Why `files.readonlyExclude`? Because `**` would also lock `.vscode/settings.json` itself, silently breaking all further writes (and making the toggle irreversible). Excluding only the settings file keeps the toggle working while other `.vscode/` files remain read-only.

## Requirements

- VS Code `^1.77.0` (where `files.readonlyInclude` / `files.readonlyExclude` were introduced).

## Development

```sh
bun install        # install dev dependencies
bun run test       # run the test suite in a headless VS Code
bun run package    # build global-readonly-<version>.vsix
```

Press `F5` inside the repo to launch an Extension Development Host.

## Contributing

Issues and pull requests are welcome. Please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](./LICENSE)
