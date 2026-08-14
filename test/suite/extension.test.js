const assert = require('assert');
const vscode = require('vscode');

const GLOBAL_PATTERN = '**';
const VSCODE_EXCLUDE_PATTERN = '**/.vscode/**';
const USER_PATTERN = 'src/**';

function getInclude() {
  return vscode.workspace.getConfiguration('files').get('readonlyInclude', {});
}

function getExclude() {
  return vscode.workspace.getConfiguration('files').get('readonlyExclude', {});
}

async function updateFiles(key, value) {
  await vscode.workspace
    .getConfiguration('files')
    .update(key, value, vscode.ConfigurationTarget.Workspace);
}

suite('Global Readonly', () => {
  test('extension activates and registers commands', async () => {
    const commands = await vscode.commands.getCommands(true);
    for (const name of ['globalReadonly.toggle', 'globalReadonly.enable', 'globalReadonly.disable']) {
      assert.ok(commands.includes(name), `missing command ${name}`);
    }
  });

  test('toggle flips the ** pattern and keeps the settings file writable', async () => {
    await vscode.commands.executeCommand('globalReadonly.toggle');
    assert.strictEqual(getInclude()[GLOBAL_PATTERN], true, 'toggle should enable');
    assert.strictEqual(getExclude()[VSCODE_EXCLUDE_PATTERN], true, 'settings file must stay writable');

    await vscode.commands.executeCommand('globalReadonly.toggle');
    assert.strictEqual(getInclude()[GLOBAL_PATTERN], undefined, 'toggle should disable');
    assert.strictEqual(getExclude()[VSCODE_EXCLUDE_PATTERN], undefined, 'exclude should be cleaned up');
  });

  test('disable preserves user-defined include patterns', async () => {
    await updateFiles('readonlyInclude', { [USER_PATTERN]: true });
    await vscode.commands.executeCommand('globalReadonly.enable');
    assert.strictEqual(getInclude()[GLOBAL_PATTERN], true);

    await vscode.commands.executeCommand('globalReadonly.disable');

    const include = getInclude();
    assert.strictEqual(include[GLOBAL_PATTERN], undefined, '** should be removed');
    assert.strictEqual(include[USER_PATTERN], true, 'user pattern must survive');
  });

  test('enable then disable persists on disk without lockout', async () => {
    await vscode.commands.executeCommand('globalReadonly.enable');
    assert.strictEqual(getInclude()[GLOBAL_PATTERN], true, 'enable should persist');

    await vscode.commands.executeCommand('globalReadonly.disable');
    assert.strictEqual(getInclude()[GLOBAL_PATTERN], undefined, 'disable should persist');
  });

  teardown(async () => {
    try {
      await updateFiles('readonlyInclude', {});
      await updateFiles('readonlyExclude', {});
    } catch (err) {
      console.warn('teardown failed:', err.message);
    }
  });
});
