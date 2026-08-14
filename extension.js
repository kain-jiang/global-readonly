const vscode = require('vscode');

const GLOBAL_PATTERN = '**';
const VSCODE_EXCLUDE_PATTERN = '**/.vscode/**';
const FILES_SECTION = 'files';
const INCLUDE_KEY = 'readonlyInclude';
const EXCLUDE_KEY = 'readonlyExclude';

function isEnabled() {
  return vscode.workspace
    .getConfiguration(FILES_SECTION)
    .get(INCLUDE_KEY, {})[GLOBAL_PATTERN] === true;
}

function getTarget() {
  return vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length
    ? vscode.ConfigurationTarget.Workspace
    : vscode.ConfigurationTarget.Global;
}

function addPattern(map, pattern) {
  const next = { ...map };
  next[pattern] = true;
  return next;
}

function removePattern(map, pattern) {
  const next = { ...map };
  delete next[pattern];
  return next;
}

async function updateSetting(key, value, target) {
  await vscode.workspace
    .getConfiguration(FILES_SECTION)
    .update(key, value, target);
}

async function setEnabled(enabled) {
  const target = getTarget();
  const files = vscode.workspace.getConfiguration(FILES_SECTION);

  try {
    if (target === vscode.ConfigurationTarget.Workspace) {
      // Keep `.vscode/` (and therefore the workspace settings file) writable
      // while the `**` include is active, so later writes keep working.
      // Order matters: apply the exclude BEFORE the include when enabling, and
      // remove the include BEFORE the exclude when disabling.
      if (enabled) {
        await updateSetting(
          EXCLUDE_KEY,
          addPattern(files.get(EXCLUDE_KEY, {}), VSCODE_EXCLUDE_PATTERN),
          target
        );
        await updateSetting(
          INCLUDE_KEY,
          addPattern(files.get(INCLUDE_KEY, {}), GLOBAL_PATTERN),
          target
        );
      } else {
        await updateSetting(
          INCLUDE_KEY,
          removePattern(files.get(INCLUDE_KEY, {}), GLOBAL_PATTERN),
          target
        );
        await updateSetting(
          EXCLUDE_KEY,
          removePattern(files.get(EXCLUDE_KEY, {}), VSCODE_EXCLUDE_PATTERN),
          target
        );
      }
    } else if (enabled) {
      await updateSetting(
        INCLUDE_KEY,
        addPattern(files.get(INCLUDE_KEY, {}), GLOBAL_PATTERN),
        target
      );
    } else {
      await updateSetting(
        INCLUDE_KEY,
        removePattern(files.get(INCLUDE_KEY, {}), GLOBAL_PATTERN),
        target
      );
    }

    const message = enabled
      ? 'Workspace is now read-only.'
      : 'Workspace is writable again.';
    vscode.window.showInformationMessage(message);
  } catch (err) {
    vscode.window.showErrorMessage(
      `Failed to ${enabled ? 'enable' : 'disable'} read-only mode: ${err.message}`
    );
    throw err;
  }
}

function activate(context) {
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBar.command = 'globalReadonly.toggle';

  function refreshStatusBar(forcedEnabled) {
    const show = vscode.workspace
      .getConfiguration('globalReadonly')
      .get('showStatusBar', true);
    if (!show) {
      statusBar.hide();
      return;
    }
    const enabled = typeof forcedEnabled === 'boolean' ? forcedEnabled : isEnabled();
    statusBar.text = enabled ? '$(lock) Readonly' : '$(unlock) Readonly';
    statusBar.tooltip = enabled
      ? 'Workspace is read-only. Click to make it writable.'
      : 'Workspace is writable. Click to make it read-only.';
    statusBar.show();
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('globalReadonly.enable', async () => {
      await setEnabled(true);
      refreshStatusBar(true);
    }),
    vscode.commands.registerCommand('globalReadonly.disable', async () => {
      await setEnabled(false);
      refreshStatusBar(false);
    }),
    vscode.commands.registerCommand('globalReadonly.toggle', async () => {
      const next = !isEnabled();
      await setEnabled(next);
      refreshStatusBar(next);
    }),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (
        event.affectsConfiguration(`${FILES_SECTION}.${INCLUDE_KEY}`) ||
        event.affectsConfiguration(`${FILES_SECTION}.${EXCLUDE_KEY}`) ||
        event.affectsConfiguration('globalReadonly.showStatusBar')
      ) {
        refreshStatusBar();
      }
    }),
    statusBar
  );

  refreshStatusBar();
}

function deactivate() {}

module.exports = { activate, deactivate };
