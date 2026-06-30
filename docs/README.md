# ZCW 语言文档

这是 ZCW 语言的官方文档站点，使用 VitePress 构建。

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm docs:dev

# 构建文档
pnpm docs:build

# 预览构建结果
pnpm docs:preview
```

## 文档结构

```
docs/
├── .vitepress/
│   ├── config.ts          # VitePress 配置
│   ├── theme/
│   │   ├── index.ts       # 主题配置
│   │   └── custom.css     # 自定义样式
│   └── components/
│       └── Playground.vue # 在线代码编辑器组件
├── guide/                 # 指南文档
│   ├── getting-started.md
│   ├── syntax.md
│   └── data-types.md
├── api/                   # API 文档
│   └── core.md
├── examples.md            # 示例
├── playground.md          # 在线 Playground
└── index.md               # 首页
```

## 部署

生产站点：**https://zcw-lang.zengchaowu.com**

```bash
# 首次：初始化 COS + CDN + DNS + HTTPS（在 workspace 根目录）
pnpm provision:site -- zcw-lang.zengchaowu.com

# 构建并上传到 COS（在 packages/zcw-lang）
pnpm deploy:cos
```

部署前须在 `packages/api.zengchaowu.com/.env.prod` 或环境变量中配置 `TENCENT_SECRET_ID`、`TENCENT_SECRET_KEY`。

构建产物目录：`docs/.vitepress/dist`。

