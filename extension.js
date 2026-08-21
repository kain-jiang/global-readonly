const vscode = require('vscode');

const GLOBAL_PATTERN = '**';
const VSCODE_EXCLUDE_PATTERN = '**/.vscode/settings.json';
const FILES_SECTION = 'files';
const INCLUDE_KEY = 'readonlyInclude';
const EXCLUDE_KEY = 'readonlyExclude';
const TEXT = {
  en: {
    workspaceRequired: 'A workspace must be open to change read-only mode.',
    enabled: 'Workspace is now read-only.',
    disabled: 'Workspace is writable again.',
    failed: (action, message) => `Failed to ${action} read-only mode: ${message}`,
    enable: 'Enable read-only mode',
    disable: 'Disable read-only mode',
    enableTooltip: 'Workspace is writable. Click to make it read-only.',
    disableTooltip: 'Workspace is read-only. Click to make it writable.',
    status: 'Readonly',
  },
  zh: {
    workspaceRequired: '请先打开一个工作区，才能更改只读模式。',
    enabled: '工作区已设为只读。',
    disabled: '工作区已恢复可写。',
    failed: (action, message) => `无法${action}只读模式：${message}`,
    enable: '启用',
    disable: '禁用',
    enableTooltip: '工作区可写。点击可设为只读。',
    disableTooltip: '工作区为只读。点击可恢复可写。',
    status: '只读',
  },
};

function getText() {
  return vscode.env.language.toLowerCase().startsWith('zh') ? TEXT.zh : TEXT.en;
}

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
  if (!vscode.workspace.workspaceFolders?.length) {
    const error = new Error(getText().workspaceRequired);
    vscode.window.showErrorMessage(error.message);
    throw error;
  }

  const target = getTarget();
  const files = vscode.workspace.getConfiguration(FILES_SECTION);

  try {
    if (target === vscode.ConfigurationTarget.Workspace) {
      // Keep the workspace settings file writable while the `**` include is
      // active, so later writes keep working.
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

    const message = enabled ? getText().enabled : getText().disabled;
    vscode.window.showInformationMessage(message);
  } catch (err) {
    const text = getText();
    vscode.window.showErrorMessage(
      text.failed(enabled ? text.enable : text.disable, err.message)
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
    if (!vscode.workspace.workspaceFolders?.length) {
      statusBar.hide();
      return;
    }
    const show = vscode.workspace
      .getConfiguration('globalReadonly')
      .get('showStatusBar', true);
    if (!show) {
      statusBar.hide();
      return;
    }
    const text = getText();
    const enabled = typeof forcedEnabled === 'boolean' ? forcedEnabled : isEnabled();
    statusBar.text = enabled ? `$(lock) ${text.status}` : `$(unlock) ${text.status}`;
    statusBar.tooltip = enabled
      ? text.disableTooltip
      : text.enableTooltip;
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
    vscode.workspace.onDidChangeWorkspaceFolders(() => refreshStatusBar()),
    statusBar
  );

  refreshStatusBar();
}

function deactivate() {}

module.exports = { activate, deactivate };
