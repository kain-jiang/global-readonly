# Change Log

## [0.0.2]

- Add `globalReadonly.showStatusBar` setting to control the status bar item.
- Respect the setting when toggling; status bar hides when disabled.
- Preserve user-defined patterns when disabling (only `**` entry is removed).

## [0.0.1]

- Initial release.
- Commands: Enable / Disable / Toggle global read-only.
- Status bar item with click-to-toggle.
- Uses `files.readonlyInclude: { "**": true }`.
