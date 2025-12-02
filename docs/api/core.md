# 核心库 API

ZCW 语言内置了 `core` 核心库，提供常用的功能方法。

## core.visit(url)

打开指定的网页 URL。

### 参数

- `url` (string): 要打开的网页 URL

### 返回值

- `boolean`: 成功返回 `true`，失败返回 `false`

### 示例

```zcw
// 打开单个网页
core.visit("https://www.example.com");

// 打开多个网页
core.visit("https://www.baidu.com");
core.visit("https://github.com");
```

### 说明

- `visit` 方法会在浏览器中打开指定的 URL
- 如果 URL 无效或无法打开，方法会返回 `false`
- 可以连续调用多个 `visit` 方法来打开多个网页

## 扩展核心库

要添加新的核心库方法，可以：

1. 在 `packages/core/src/core.ts` 文件中添加新方法
2. 在 `methods` 对象中注册新方法
3. 重新构建和测试功能

查看[开发文档](/guide/development)了解更多信息。

