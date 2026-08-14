const path = require('path');
const fs = require('fs');
const { runTests } = require('@vscode/test-electron');

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '..');
    const extensionTestsPath = path.resolve(__dirname, './suite/index.js');
    const testWorkspace = path.resolve(__dirname, '..', 'test-fixture');

    // Start from a clean slate: a previous run may have left the fixture's
    // settings file locked (read-only), which would break subsequent writes.
    fs.rmSync(path.join(testWorkspace, '.vscode'), { recursive: true, force: true });

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        testWorkspace,
        '--user-data-dir',
        path.resolve(__dirname, '..', '.vscode-test', 'user-data'),
      ],
    });
  } catch (err) {
    console.error('Failed to run tests:', err);
    process.exit(1);
  }
}

main();
