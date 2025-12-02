# 语法指南

本文档介绍 ZCW 语言的语法规则。

## 注释

ZCW 支持单行注释，以 `//` 开头：

```zcw
// 这是单行注释
core.visit("https://example.com"); // 行尾注释
```

## 数据类型

### 字符串

字符串使用双引号包围：

```zcw
core.visit("https://www.example.com");
```

### 数字

支持整数和浮点数：

```zcw
// 整数
123

// 浮点数
3.14
```

### 标识符

标识符由字母、数字和下划线组成，不能以数字开头：

```zcw
core
visit
my_variable
```

## 语法结构

### 方法调用

ZCW 支持对象方法调用：

```zcw
object.method(argument);
```

示例：

```zcw
core.visit("https://www.example.com");
```

### 语句分隔

语句使用分号 `;` 分隔：

```zcw
core.visit("https://www.example.com");
core.visit("https://www.baidu.com");
```

## 词法标记

ZCW 语言支持以下标记类型：

- `CORE`: 核心库标识符
- `IDENTIFIER`: 标识符
- `STRING`: 字符串字面量
- `NUMBER`: 数字字面量
- `DOT`: 点号 `.`
- `LPAREN`: 左括号 `(`
- `RPAREN`: 右括号 `)`
- `SEMICOLON`: 分号 `;`

## 错误处理

ZCW 提供详细的错误信息：

- **词法错误**：显示位置和意外字符
- **语法错误**：显示期望的标记类型
- **运行时错误**：显示方法调用错误

## 示例

```zcw
// 打开多个网页
core.visit("https://www.example.com");
core.visit("https://www.baidu.com");
core.visit("https://github.com");
```

