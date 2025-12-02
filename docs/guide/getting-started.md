# 快速开始

本指南将帮助你快速开始使用 ZCW 语言。

## 安装

### 使用 npm

```bash
npm install zcw-lang
```

### 使用 pnpm

```bash
pnpm add zcw-lang
```

### 使用 yarn

```bash
yarn add zcw-lang
```

## 基本使用

### 创建你的第一个 .zcw 文件

创建一个名为 `hello.zcw` 的文件：

```zcw
// 我的第一个 ZCW 程序
core.visit("https://www.example.com");
```

### 运行文件

```bash
# 使用 CLI
zcw hello.zcw

# 或使用 node
node dist/index.js hello.zcw
```

## 调试模式

启用调试模式可以查看词法分析和语法分析的详细过程：

```bash
DEBUG=1 zcw hello.zcw
```

调试模式会显示：
- 标记流（Token Stream）
- 抽象语法树（AST）
- 详细的执行过程

## 下一步

- 查看[语法指南](/guide/syntax)了解 ZCW 语言的语法
- 查看[API 参考](/api/core)了解可用的核心库方法
- 在[在线 Playground](/playground)中尝试编写代码

