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

文档可以部署到：
- Vercel
- Netlify
- GitHub Pages
- 任何静态文件托管服务

构建后的文件在 `docs/.vitepress/dist` 目录。

