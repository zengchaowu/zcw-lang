# ZCW语言

一个简单的自定义DSL语言，文件后缀为.zcw - **TypeScript版本**。

## 特性

- 支持基本的语法结构
- 内置核心库core，提供visit方法用于打开网页
- 简单的解释器实现
- 支持注释（// 开头的单行注释）
- 支持调试模式
- **完全使用TypeScript实现，提供类型安全**
- 支持现代ES模块
- **模块化架构，核心库独立成包**
- **使用pnpm monorepo管理多包项目**

## 安装和使用

### 基本使用

```bash
# 安装依赖
pnpm install

# 构建所有模块
pnpm build

# 运行.zcw文件
pnpm start example.zcw
# 或者
node dist/index.js example.zcw

# 调试模式（显示词法分析和语法分析过程）
DEBUG=1 pnpm start example.zcw

# 运行测试
pnpm test
# 或者
node dist/test.js

# 开发模式（构建并运行）
pnpm dev example.zcw

# 清理所有构建文件
pnpm clean
```

### 语法示例

```zcw
// 这是注释
// 打开网页
core.visit("https://www.example.com");

// 可以连续调用多个方法
core.visit("https://www.baidu.com");
core.visit("https://github.com");
```

## 核心库

### core.visit(url)
打开指定的网页URL。

**参数：**
- `url` (string): 要打开的网页URL

**返回值：**
- `boolean`: 成功返回true，失败返回false

**示例：**
```zcw
core.visit("https://www.example.com");
```

## 语言特性

### 支持的数据类型
- 字符串：用双引号包围，如 `"hello world"`
- 数字：整数和浮点数，如 `123` 或 `3.14`
- 标识符：字母、数字、下划线组成，如 `core`、`visit`

### 支持的语法结构
- 方法调用：`object.method(argument);`
- 注释：`// 这是注释`
- 语句分隔：使用分号 `;`

### 词法分析
ZCW语言支持以下标记类型：
- `CORE`: 核心库标识符
- `IDENTIFIER`: 标识符
- `STRING`: 字符串字面量
- `NUMBER`: 数字字面量
- `DOT`: 点号
- `LPAREN`: 左括号
- `RPAREN`: 右括号
- `SEMICOLON`: 分号

## 项目结构

```
zcw-lang/
├── packages/               # 模块包
│   ├── core/              # 核心库模块
│   │   ├── src/
│   │   │   ├── types.ts   # 核心库类型定义
│   │   │   ├── core.ts    # 核心库实现
│   │   │   └── index.ts   # 核心库入口
│   │   ├── dist/          # 编译后的文件
│   │   ├── package.json   # 核心库配置
│   │   └── tsconfig.json  # 核心库TypeScript配置
│   └── runtime/           # 运行时模块
│       ├── src/
│       │   ├── types.ts   # 运行时类型定义
│       │   ├── lexer.ts   # 词法分析器
│       │   ├── parser.ts  # 语法分析器
│       │   ├── interpreter.ts # 解释器
│       │   └── index.ts   # 运行时入口
│       ├── dist/          # 编译后的文件
│       ├── package.json   # 运行时配置
│       └── tsconfig.json  # 运行时TypeScript配置
├── src/                   # 主项目源代码
│   ├── index.ts          # 主入口文件
│   └── test.ts           # 测试文件
├── dist/                  # 主项目编译后的文件
├── example.zcw           # 示例文件
├── package.json          # 主项目配置
├── tsconfig.json         # 主项目TypeScript配置
├── pnpm-workspace.yaml   # pnpm工作空间配置
└── README.md             # 说明文档
```

## 开发

```bash
# 安装依赖
pnpm install

# 构建所有模块
pnpm build

# 运行示例
pnpm start example.zcw

# 运行测试
pnpm test

# 开发模式（构建并运行）
pnpm dev example.zcw

# 调试模式
DEBUG=1 pnpm start example.zcw

# 清理所有构建文件
pnpm clean

# 单独构建某个模块
pnpm --filter @zcw-lang/core build
pnpm --filter @zcw-lang/runtime build
```

## 扩展

### 添加新的核心库方法

要添加新的核心库方法，可以在 `packages/core/src/core.ts` 文件中：

1. 在 `Core` 类中添加新方法
2. 在 `methods` 对象中注册新方法
3. 重新构建和测试功能

```typescript
// 在 Core 类中添加新方法
async newMethod(param: string): Promise<boolean> {
  // 方法实现
  return true;
}

// 在构造函数中注册方法
constructor(config: CoreConfig = {}) {
  this.methods = {
    visit: this.visit.bind(this),
    newMethod: this.newMethod.bind(this)  // 添加新方法
  };
}
```

### 模块化开发

项目采用模块化架构，每个模块都可以独立开发和测试：

- **@zcw-lang/core**: 核心库模块，提供内置功能
- **@zcw-lang/runtime**: 运行时模块，包含词法分析器、语法分析器和解释器

### 添加新的运行时功能

要添加新的运行时功能，可以在 `packages/runtime/src/` 目录中添加新文件，并在 `index.ts` 中导出。

## 错误处理

ZCW语言提供详细的错误信息：
- 词法错误：显示位置和意外字符
- 语法错误：显示期望的标记类型
- 运行时错误：显示方法调用错误

## 调试

使用 `DEBUG=1` 环境变量可以启用调试模式，显示：
- 词法分析结果（标记流）
- 语法分析结果（抽象语法树）
- 详细的执行过程
