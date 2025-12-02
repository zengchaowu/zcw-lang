# 数据类型

ZCW 语言支持以下数据类型：

## 字符串 (String)

字符串使用双引号 `"` 包围，可以包含任意字符：

```zcw
"hello world"
"https://www.example.com"
"这是一个中文字符串"
```

## 数字 (Number)

支持整数和浮点数：

```zcw
123        // 整数
3.14       // 浮点数
0          // 零
-42        // 负数（如果支持）
```

## 标识符 (Identifier)

标识符用于命名变量、对象和方法：

- 由字母、数字和下划线组成
- 不能以数字开头
- 区分大小写

示例：

```zcw
core          // 有效
visit         // 有效
my_variable   // 有效
_private      // 有效
123invalid    // 无效（以数字开头）
```

## 对象和方法

ZCW 支持对象方法调用：

```zcw
object.method(argument);
```

- `object`: 对象标识符（如 `core`）
- `method`: 方法标识符（如 `visit`）
- `argument`: 方法参数（字符串、数字等）

## 类型转换

ZCW 语言会根据上下文自动处理类型转换。例如，字符串参数会被正确传递给方法。

