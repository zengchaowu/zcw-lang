# 功能特性

ZCW 语言提供了丰富的功能模块，覆盖爬虫、网络、移动设备、自动化和动态分析等多个领域。

## 🕷️ 爬虫模块 (Crawler)

### 核心功能

- **动态网页支持**：内置无头浏览器（Puppeteer/Playwright），支持 JavaScript 渲染
- **智能反爬虫**：自动处理验证码、IP 封禁、User-Agent 轮换
- **数据提取**：强大的 CSS 选择器和 XPath 支持
- **分布式爬虫**：支持多进程、多线程、分布式部署

### 使用示例

```zcw
// 访问网页
crawler.visit("https://example.com");

// 等待元素加载
crawler.waitForSelector(".content");

// 提取数据
var title = crawler.extract(".title", "text");
var price = crawler.extract(".price", "text");

// 提取多个元素
var links = crawler.extractAll("a", "href");

// 保存数据
crawler.save("data.json", {title: title, price: price, links: links});
```

## 🌐 网络模块 (Network)

### 核心功能

- **HTTP/HTTPS 请求**：GET、POST、PUT、DELETE 等完整支持
- **WebSocket 通信**：实时双向通信
- **代理管理**：支持 HTTP、SOCKS5 代理，自动轮换
- **Cookie 和 Session**：自动管理会话状态
- **请求拦截**：支持中间件模式，拦截和修改请求

### 使用示例

```zcw
// GET 请求
var response = network.get("https://api.example.com/data", {
    headers: {"Authorization": "Bearer token"},
    proxy: "http://proxy.example.com:8080"
});

// POST 请求
var result = network.post("https://api.example.com/submit", {
    body: {"key": "value"},
    headers: {"Content-Type": "application/json"}
});

// WebSocket 连接
var ws = network.websocket("wss://example.com/ws");
ws.send("Hello");
ws.onMessage(function(data) {
    console.log("收到消息:", data);
});
```

## 📱 设备模块 (Device)

### 核心功能

- **Android/iOS 支持**：统一的 API 操作不同平台
- **应用自动化**：安装、启动、操作、卸载应用
- **屏幕操作**：点击、滑动、长按、手势识别
- **设备信息**：获取设备型号、系统版本、安装应用列表
- **文件传输**：设备与电脑之间的文件上传下载

### 使用示例

```zcw
// 连接 Android 设备
device.connect("android://192.168.1.100:5555");

// 安装应用
device.install("app.apk");

// 启动应用
device.launch("com.example.app");

// 屏幕操作
device.tap(500, 1000);
device.swipe(300, 500, 300, 1000, 500);
device.longPress(500, 1000, 2000);

// 获取设备信息
var info = device.getInfo();
console.log("设备型号:", info.model);
console.log("系统版本:", info.version);
```

## 🔧 自动化模块 (Automation)

### 核心功能

- **浏览器自动化**：Puppeteer/Playwright 集成
- **文件操作**：文件读写、目录遍历、批量处理
- **系统命令**：执行系统命令、调用外部程序
- **定时任务**：支持 Cron 表达式
- **任务调度**：任务队列、优先级管理、失败重试

### 使用示例

```zcw
// 浏览器自动化
browser.open("https://example.com");
browser.fill("#username", "user");
browser.fill("#password", "pass");
browser.click("#login");

// 文件操作
file.read("data.txt");
file.write("output.txt", "content");
file.listDir("/path/to/dir");

// 定时任务
schedule.cron("0 0 * * *", function() {
    console.log("每天执行一次");
});
```

## 🎣 Hook 模块 (Frida)

### 核心功能

- **Frida 集成**：内嵌 Frida 动态分析框架
- **运行时 Hook**：函数拦截、参数修改、返回值替换
- **内存操作**：内存读取、写入、搜索、修改
- **加密分析**：加密算法 Hook、密钥提取
- **逆向工程**：应用逆向、协议分析

### 使用示例

```zcw
// 附加到进程
frida.attach("com.example.app");

// Hook 函数
frida.hook("com.example.Crypto.encrypt", function(args) {
    console.log("加密前:", args[0]);
    var result = this.encrypt(args[0]);
    console.log("加密后:", result);
    return result;
});

// 内存操作
var addr = frida.findPattern("48 89 5C 24 08");
var value = frida.readMemory(addr, 16);
frida.writeMemory(addr, "new data");
```

## 模块组合使用

ZCW 语言的强大之处在于可以轻松组合不同模块：

```zcw
// 爬虫 + 网络 + 设备
crawler.visit("https://example.com");
var data = crawler.extract(".data", "text");
network.post("https://api.example.com/save", {body: data});
device.notify("数据已保存");
```

