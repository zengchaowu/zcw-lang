---
layout: home

hero:
  name: "ZCW 语言"
  text: "强大的脚本语言"
  tagline: 专为自动化、爬虫、网络操作和移动设备控制而设计的现代化脚本语言
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在线体验
      link: /playground

features:
  - icon: 🕷️
    title: 强大的爬虫能力
    details: 内置完整的网页爬虫工具链，支持动态内容抓取、数据提取、反爬虫绕过等高级功能
  - icon: 🌐
    title: 网络操作专家
    details: 提供 HTTP/HTTPS 请求、WebSocket 通信、代理管理、Cookie 处理等完整的网络操作能力
  - icon: 📱
    title: 移动设备控制
    details: 支持 Android/iOS 设备自动化，应用控制、屏幕操作、设备信息获取等移动端操作
  - icon: 🔧
    title: 自动化工具集
    details: 浏览器自动化、文件操作、系统命令执行、定时任务等丰富的自动化能力
  - icon: 🎣
    title: 内嵌 Hook 引擎
    details: 深度集成 Frida 等强大的动态分析工具，支持运行时 Hook、函数拦截、内存操作等高级功能
  - icon: ⚡️
    title: 高性能执行
    details: TypeScript 原生实现，零依赖运行时，快速执行，适合生产环境使用
---

## 什么是 ZCW 语言？

ZCW 是一门**现代化的脚本语言**，专为自动化任务、数据采集、移动设备控制和动态分析而设计。它不仅仅是一个简单的 DSL，而是一个功能完整的**自动化开发平台**。

ZCW 语言集成了爬虫框架、网络工具库、移动设备 SDK 和强大的 Hook 引擎（如 Frida），让你能够用简洁的语法完成复杂的自动化任务。

## 快速示例

### 网页爬虫示例

```zcw
// 访问网页并提取数据
crawler.visit("https://example.com");
crawler.extract(".title", "text");
crawler.save("data.json");
```

### 网络请求示例

```zcw
// 发送 HTTP 请求
network.get("https://api.example.com/data");
network.post("https://api.example.com/submit", {"key": "value"});
```

### 移动设备控制示例

```zcw
// 连接 Android 设备并执行操作
device.connect("android://192.168.1.100");
device.tap(500, 1000);
device.swipe(300, 500, 300, 1000);
```

### Hook 和动态分析示例

```zcw
// 使用 Frida Hook 函数
frida.attach("com.example.app");
frida.hook("encrypt", function(args) {
    console.log("加密参数:", args);
});
```

## 为什么选择 ZCW？

### 🎯 一站式解决方案

ZCW 语言集成了爬虫、网络、移动设备和自动化工具，无需学习多个框架，一个语言解决所有问题。

### 🕷️ 强大的爬虫能力

- 支持 JavaScript 渲染的动态网页
- 智能反爬虫绕过机制
- 数据提取和清洗工具
- 分布式爬虫支持

### 📱 移动设备全支持

- Android/iOS 设备连接和控制
- 应用自动化测试
- 屏幕录制和回放
- 设备信息获取和管理

### 🎣 深度 Hook 能力

- 内嵌 Frida 动态分析引擎
- 运行时函数 Hook 和拦截
- 内存读写和修改
- 加密算法逆向分析

### ⚡️ 现代化技术栈

- TypeScript 原生实现，类型安全
- 模块化架构，易于扩展
- 零依赖运行时，快速启动
- 完整的开发工具链

## 安装

```bash
# 使用 npm
npm install zcw-lang

# 使用 pnpm
pnpm add zcw-lang

# 使用 yarn
yarn add zcw-lang
```

## 开始使用

```bash
# 运行 .zcw 文件
zcw example.zcw

# 或使用 node
node dist/index.js example.zcw
```

[查看完整文档 →](/guide/getting-started)

