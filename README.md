# Global Readonly

Toggle **read-only mode for the entire workspace** with one click, powered by VS Code's built-in [`files.readonlyInclude`](https://code.visualstudio.com/api/references/vscode-api#workspace-configuration) feature — no file watchers, no monkey patching.

## Features

- **One-click toggle** — click the status bar item (or run a command) to make the whole workspace read-only / writable.
- **Uses native VS Code settings** — sets `files.readonlyInclude: { "**": true }`, so read-only state is enforced by VS Code itself, persists across restarts, and respects the standard read-only UX (no accidental edits).
- **Preserves your rules** — when disabling, only the `**` entry is removed; any other patterns you added to `files.readonlyInclude` are kept.
- **Works without a workspace** — falls back to writing the user-level (global) setting when no folder is open.
- **Status bar indicator** — shows `$(lock) Readonly` / `$(unlock) Readonly` and reflects the live state even if you change the setting manually.

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

## Requirements

- VS Code `^1.77.0` (where `files.readonlyInclude` / `files.readonlyExclude` were introduced).

## How it works

The extension reads and writes the built-in `files.readonlyInclude` configuration:

```json
{
  "files.readonlyInclude": {
    "**": true
  }
}
```

The `**` glob matches every file in the workspace, marking them read-only. Disabling simply removes that entry, leaving any user-defined patterns untouched.

## Development

```sh
npm install        # install dev dependencies
npm test           # run the test suite in a headless VS Code
npm run package    # build global-readonly-<version>.vsix
```

Press `F5` inside the repo to launch an Extension Development Host.

## License

[MIT](LICENSE)
