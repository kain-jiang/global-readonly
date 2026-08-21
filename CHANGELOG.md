# Change Log

## [0.0.5]

- Fix flaky test: await extension activation before asserting registered commands.
- Add tag-triggered release workflow: tests, VSIX packaging, GitHub Release with changelog-based notes, and automatic publishing to the VS Code Marketplace.

## [0.0.4]

- Add `enablement` conditions: Enable / Disable / Toggle commands are disabled when no workspace folder is open (`workspaceFolderCount > 0`).
- Migrate from npm to Bun (`bun@1.3.14`), replacing `package-lock.json` with `bun.lock`.
- CI: run tests via Bun, narrow test exclude pattern to `.vscode/settings.json`, await extension activation in tests.

## [0.0.3]

- Add extension icon and marketplace metadata (keywords, homepage, gallery banner).
- Publish bilingual README (中文 / English) and community files (CONTRIBUTING, CODE_OF_CONDUCT, SECURITY).
- Add GitHub issue templates.

## [0.0.2]

- Fix lockout: `**` made `.vscode/settings.json` read-only so the toggle could not be flipped back. Enable now writes `files.readonlyExclude: { "**/.vscode/**": true }` **before** the include, and removes the include **before** the exclude when disabling, keeping the settings file writable at all times.
- Add `globalReadonly.showStatusBar` setting to control the status bar item.
- Add integration tests (`@vscode/test-electron`) and a CI workflow.
- Add README, LICENSE, CHANGELOG, .vscodeignore, .gitignore.

## [0.0.1]

- Initial release.
- Commands: Enable / Disable / Toggle global read-only.
- Status bar item with click-to-toggle.
- Uses `files.readonlyInclude: { "**": true }`.
