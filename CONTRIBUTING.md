# Contributing to Global Readonly

Thanks for taking the time to contribute! :tada:

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to contribute

### Report bugs

Open an issue using the [Bug report template](.github/ISSUE_TEMPLATE/bug_report.md). Please include:

- VS Code version and platform
- Extension version
- Steps to reproduce
- Expected vs. actual behavior

### Suggest features

Open an issue using the [Feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and describe:

- The problem you are trying to solve
- The behavior you expect
- Alternatives you have considered

### Submit code

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-feature`.
3. Make your changes and add tests where possible.
4. Run the checks:

   ```sh
   npm test           # integration tests (headless VS Code)
   npm run package    # verify the extension packages cleanly
   ```

5. Commit with a clear message and open a pull request against `main`.

## Development setup

```sh
npm install        # install dev dependencies
npm test           # run the test suite in a headless VS Code
```

Press `F5` inside the repo to launch an Extension Development Host for debugging.

## Code style

- Keep it plain CommonJS (no build step).
- Do not add comments unless they explain *why* (mimic the existing style).
- Preserve existing user settings: always merge, never clobber `files.readonlyInclude` / `files.readonlyExclude`.

## Release checklist (maintainers)

1. Bump `version` in `package.json`.
2. Add an entry to `CHANGELOG.md`.
3. Create a Git tag `v<version>` and push.
4. (Optional) Publish the VSIX to the VS Code Marketplace.
