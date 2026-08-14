# Security Policy

## Supported Versions

Security fixes are provided for the latest released version.

| Version | Supported |
| --- | --- |
| latest | :white_check_mark: |
| < latest | :x: |

## Reporting a Vulnerability

Please **do not** open a public issue for security vulnerabilities.

Instead, report privately by opening a [security advisory](https://github.com/kain-jiang/global-readonly/security/advisories/new) or by emailing the maintainers. You should receive a response within a few days. If the issue is confirmed, a fix will be released and the reporter will be credited (unless they prefer to stay anonymous).

Please include in your report:

- Description of the vulnerability and its impact
- Steps to reproduce
- Affected VS Code versions
- Any suggested mitigation

## Scope

This extension only writes workspace/user settings keys (`files.readonlyInclude`, `files.readonlyExclude`) and does not handle external input. Please report any behavior that:

- Executes arbitrary code
- Modifies files outside the configured settings keys
- Leaks sensitive information
