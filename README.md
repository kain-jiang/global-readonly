<div align="center">

# Global Readonly

**一键切换整个工作区为只读的 VS Code 扩展**

[English](./README.en.md) · [中文](./README.md)

[![License](https://img.shields.io/github/license/kain-jiang/global-readonly)](https://github.com/kain-jiang/global-readonly/blob/main/LICENSE)
[![CI](https://github.com/kain-jiang/global-readonly/actions/workflows/ci.yml/badge.svg)](https://github.com/kain-jiang/global-readonly/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/VS%20Code-%5E1.77.0-blue)](https://code.visualstudio.com/updates/v1_77)
[![Stars](https://img.shields.io/github/stars/kain-jiang/global-readonly?style=social)](https://github.com/kain-jiang/global-readonly)

</div>

---

基于 VS Code 内置的 [`files.readonlyInclude`](https://code.visualstudio.com/docs/getstarted/settings) 实现全局只读，**无需文件监听、无需 Monkey Patch**，只读状态完全由 VS Code 原生机制保证，重启后依然生效。

## 特性

- **一键切换** —— 点击状态栏图标（或执行命令）即可让整个工作区只读 / 可写。
- **原生机制** —— 写入 `files.readonlyInclude: { "**": true }`，由 VS Code 自身强制执行只读，拥有标准的只读体验（不会误编辑、可安全退出）。
- **仅设置文件保持可写** —— 自动通过 `files.readonlyExclude` 仅排除 `.vscode/settings.json`，保证开关可以反复切换、其他 `.vscode/` 文件仍保持只读。
- **保留你的规则** —— 关闭时只移除 `**` 条目，你自定义的其他 `readonlyInclude` / `readonlyExclude` 规则全部保留。
- **仅工作区可用** —— 未打开工作区时，命令和状态栏入口都会隐藏或禁用，不会修改全局设置。
- **状态栏指示** —— 显示 `$(lock) Readonly` / `$(unlock) Readonly`，即使手动改过设置也会实时同步状态。

## 命令

| 命令 | 说明 |
| --- | --- |
| `Global Readonly: Enable` | 使整个工作区只读 |
| `Global Readonly: Disable` | 使整个工作区可写 |
| `Global Readonly: Toggle` | 在只读 / 可写之间切换 |

## 使用方法

1. 安装扩展（通过 VSIX 或 Marketplace）。
2. 点击状态栏右侧的 **Readonly** 图标即可切换，或从命令面板（`Ctrl+Shift+P`）执行上述任一命令。

启用后，工作区内的所有文件都会在编辑器中变为只读。

## 设置

| 设置项 | 默认值 | 说明 |
| --- | --- | --- |
| `globalReadonly.showStatusBar` | `true` | 是否显示状态栏图标（点击可切换） |

## 工作原理

扩展读写 VS Code 内置的 `files.readonlyInclude` 配置：

```jsonc
{
  // 启用后自动写入（同时写入 readonlyExclude 保证设置文件可写）
  "files.readonlyInclude": { "**": true },
  "files.readonlyExclude": { "**/.vscode/settings.json": true }
}
```

`**` 匹配工作区内的所有文件，使它们变为只读。关闭时仅移除这些条目，不触碰你已有的任何规则。

> 为什么需要 `files.readonlyExclude`？因为 `**` 也会把 `.vscode/settings.json` 自己锁成只读，导致配置 API 无法再写入、无法关闭。仅排除设置文件后开关始终可正常工作，同时 `.vscode/` 中的其他文件仍保持只读。

## 环境要求

- VS Code `^1.77.0`（`files.readonlyInclude` / `files.readonlyExclude` 自该版本引入）。

## 开发

```sh
bun install        # 安装开发依赖
bun run test        # 在无头 VS Code 中运行测试
bun run package     # 打包生成 global-readonly-<version>.vsix
```

在仓库内按 `F5` 即可启动 Extension Development Host 进行调试。

## 贡献

欢迎提交 Issue 与 Pull Request，请阅读 [贡献指南](./CONTRIBUTING.md) 与 [行为准则](./CODE_OF_CONDUCT.md)。

## 版本记录

参见 [CHANGELOG.md](./CHANGELOG.md)。

## 开源协议

[MIT](./LICENSE)
