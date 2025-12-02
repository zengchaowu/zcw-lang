# ZCW 语言

**强大的现代化脚本语言** - 专为自动化、爬虫、网络操作和移动设备控制而设计

ZCW 是一门功能完整的脚本语言，文件后缀为 `.zcw`，采用 **TypeScript 原生实现**。它不仅提供了简洁的语法，更集成了爬虫框架、网络工具库、移动设备 SDK 和强大的 Hook 引擎（如 Frida），让你能够用最少的代码完成最复杂的任务。

## 核心特性

### 🕷️ 强大的爬虫能力
- **动态网页支持**：内置无头浏览器，支持 JavaScript 渲染的现代网页
- **智能反爬虫**：自动处理验证码、IP 封禁、User-Agent 轮换等
- **数据提取**：强大的选择器和数据清洗工具
- **分布式爬虫**：支持多进程、多线程、分布式部署

### 🌐 完整的网络工具
- **HTTP/HTTPS 请求**：GET、POST、PUT、DELETE 等完整支持
- **WebSocket 通信**：实时双向通信能力
- **代理管理**：支持 HTTP、SOCKS5 代理，自动轮换
- **Cookie 和 Session**：自动管理会话状态
- **请求拦截和修改**：支持中间件模式

### 📱 移动设备控制
- **Android/iOS 支持**：统一的 API 操作不同平台设备
- **应用自动化**：应用安装、启动、操作、卸载
- **屏幕操作**：点击、滑动、长按、手势识别
- **设备信息**：获取设备型号、系统版本、安装应用列表等
- **文件传输**：设备与电脑之间的文件上传下载

### 🔧 自动化工具集
- **浏览器自动化**：Puppeteer/Playwright 集成，网页操作自动化
- **文件操作**：文件读写、目录遍历、批量处理
- **系统命令**：执行系统命令、调用外部程序
- **定时任务**：支持 Cron 表达式，定时执行脚本
- **任务调度**：任务队列、优先级管理、失败重试

### 🎣 内嵌 Hook 引擎
- **Frida 深度集成**：内嵌 Frida 动态分析框架
- **运行时 Hook**：函数拦截、参数修改、返回值替换
- **内存操作**：内存读取、写入、搜索、修改
- **加密分析**：加密算法 Hook、密钥提取、数据解密
- **逆向工程**：应用逆向、协议分析、算法还原

### ⚡️ 技术优势
- **TypeScript 原生**：完整的类型定义和类型安全
- **模块化架构**：核心库和运行时分离，易于扩展
- **零依赖运行时**：快速启动，资源占用低
- **现代化工具链**：支持调试、热重载、代码提示

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

#### 网页爬虫示例
```zcw
// 访问网页并提取数据
crawler.visit("https://example.com");
crawler.waitForSelector(".content");
var title = crawler.extract(".title", "text");
var links = crawler.extractAll("a", "href");
crawler.save("result.json", {title: title, links: links});
```

#### 网络请求示例
```zcw
// 发送 HTTP 请求
var response = network.get("https://api.example.com/data", {
    headers: {"Authorization": "Bearer token"},
    proxy: "http://proxy.example.com:8080"
});
console.log(response.json());
```

#### 移动设备控制示例
```zcw
// 连接 Android 设备
device.connect("android://192.168.1.100:5555");
device.install("app.apk");
device.launch("com.example.app");
device.tap(500, 1000);
device.swipe(300, 500, 300, 1000, 500);
```

#### Hook 和动态分析示例
```zcw
// 使用 Frida Hook 加密函数
frida.attach("com.example.app");
frida.hook("com.example.Crypto.encrypt", function(args) {
    console.log("加密前数据:", args[0]);
    var result = this.encrypt(args[0]);
    console.log("加密后数据:", result);
    return result;
});
```

## 核心库模块

### crawler - 爬虫模块
提供完整的网页爬虫功能，支持动态内容、反爬虫绕过、数据提取等。

### network - 网络模块
HTTP/HTTPS 请求、WebSocket 通信、代理管理、Cookie 处理等网络操作。

### device - 设备模块
Android/iOS 设备连接、应用控制、屏幕操作、文件传输等移动设备功能。

### automation - 自动化模块
浏览器自动化、文件操作、系统命令执行、定时任务等自动化工具。

### frida - Hook 模块
Frida 动态分析框架集成，支持函数 Hook、内存操作、加密分析等。

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
