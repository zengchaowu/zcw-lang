# 示例

这里提供一些 ZCW 语言的实用示例代码，展示爬虫、网络、移动设备和自动化等功能。

## 爬虫示例

### 基础网页爬虫

```zcw
// 访问网页并提取数据
crawler.visit("https://example.com");
crawler.waitForSelector(".content");
var title = crawler.extract(".title", "text");
var price = crawler.extract(".price", "text");
crawler.save("data.json", {title: title, price: price});
```

### 批量爬取数据

```zcw
// 爬取多个页面
var urls = ["https://example.com/page1", "https://example.com/page2"];
for (var i = 0; i < urls.length; i++) {
    crawler.visit(urls[i]);
    var data = crawler.extractAll(".item", "text");
    crawler.save("page" + i + ".json", data);
}
```

## 网络请求示例

### HTTP 请求

```zcw
// GET 请求
var response = network.get("https://api.example.com/data", {
    headers: {"Authorization": "Bearer token"}
});
console.log(response.json());

// POST 请求
var result = network.post("https://api.example.com/submit", {
    body: {"key": "value"},
    headers: {"Content-Type": "application/json"}
});
```

### 使用代理

```zcw
// 通过代理发送请求
var response = network.get("https://example.com", {
    proxy: "http://proxy.example.com:8080"
});
```

## 移动设备示例

### Android 设备操作

```zcw
// 连接设备
device.connect("android://192.168.1.100:5555");

// 安装并启动应用
device.install("app.apk");
device.launch("com.example.app");

// 执行操作
device.tap(500, 1000);
device.swipe(300, 500, 300, 1000);
```

### 获取设备信息

```zcw
device.connect("android://192.168.1.100:5555");
var info = device.getInfo();
console.log("设备型号:", info.model);
console.log("系统版本:", info.version);
console.log("已安装应用:", info.apps);
```

## 自动化示例

### 浏览器自动化

```zcw
// 打开浏览器并操作
browser.open("https://example.com");
browser.fill("#username", "user");
browser.fill("#password", "pass");
browser.click("#login");
browser.waitForNavigation();
```

### 定时任务

```zcw
// 每天执行一次
schedule.cron("0 0 * * *", function() {
    crawler.visit("https://example.com");
    var data = crawler.extractAll(".item", "text");
    network.post("https://api.example.com/save", {body: data});
});
```

## Hook 示例

### 函数 Hook

```zcw
// 附加到应用并 Hook 函数
frida.attach("com.example.app");
frida.hook("com.example.Crypto.encrypt", function(args) {
    console.log("加密前:", args[0]);
    var result = this.encrypt(args[0]);
    console.log("加密后:", result);
    return result;
});
```

### 内存操作

```zcw
// 查找并修改内存
var addr = frida.findPattern("48 89 5C 24 08");
var value = frida.readMemory(addr, 16);
frida.writeMemory(addr, "new data");
```

## 组合使用示例

### 爬虫 + 网络 + 设备

```zcw
// 爬取数据并保存到服务器，然后通知设备
crawler.visit("https://example.com");
var data = crawler.extractAll(".item", "text");
network.post("https://api.example.com/save", {body: data});
device.connect("android://192.168.1.100:5555");
device.notify("数据已保存");
```

## 在 Playground 中尝试

你可以在[在线 Playground](/playground)中运行这些示例，实时查看结果。

